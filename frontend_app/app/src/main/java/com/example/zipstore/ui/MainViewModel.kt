package com.example.zipstore.ui

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.zipstore.data.model.CartItem
import com.example.zipstore.data.model.Product
import com.example.zipstore.data.repository.ProductRepository
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ProductRepository()
    private val auth = FirebaseAuth.getInstance()
    private val sharedPreferences = application.getSharedPreferences("zipstore_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    private val _uiEvent = MutableSharedFlow<String>()
    val uiEvent: SharedFlow<String> = _uiEvent.asSharedFlow()

    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    val cart: StateFlow<List<CartItem>> = _cart.asStateFlow()

    private val _isLoggedIn = MutableStateFlow(auth.currentUser != null)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    init {
        fetchProducts()
        loadCart()
    }

    private fun fetchProducts() {
        android.util.Log.d("MainViewModel", "fetchProducts() started")
        viewModelScope.launch {
            repository.getProducts().collect {
                android.util.Log.d("MainViewModel", "Received ${it.size} products")
                _products.value = it
                _isLoading.value = false
            }
        }
    }

    private fun loadCart() {
        val cartJson = sharedPreferences.getString("cart_items", null)
        if (cartJson != null) {
            val type = object : TypeToken<List<CartItem>>() {}.type
            try {
                val savedCart: List<CartItem> = gson.fromJson(cartJson, type)
                _cart.value = savedCart
            } catch (e: Exception) {
                _cart.value = emptyList()
            }
        }
    }

    private fun saveCart() {
        val cartJson = gson.toJson(_cart.value)
        sharedPreferences.edit().putString("cart_items", cartJson).apply()
    }

    fun showMessage(message: String) {
        viewModelScope.launch {
            _uiEvent.emit(message)
        }
    }

    fun addToCart(product: Product) {
        val currentCart = _cart.value.toMutableList()
        val existingItem = currentCart.find { it.product.id == product.id }
        if (existingItem != null) {
            val index = currentCart.indexOf(existingItem)
            currentCart[index] = existingItem.copy(quantity = existingItem.quantity + 1)
        } else {
            currentCart.add(CartItem(product))
        }
        _cart.value = currentCart
        saveCart()
        showMessage("${product.name} added to cart")
    }

    fun removeFromCart(product: Product) {
        val currentCart = _cart.value.toMutableList()
        val existingItem = currentCart.find { it.product.id == product.id }
        if (existingItem != null) {
            if (existingItem.quantity > 1) {
                val index = currentCart.indexOf(existingItem)
                currentCart[index] = existingItem.copy(quantity = existingItem.quantity - 1)
            } else {
                currentCart.remove(existingItem)
            }
        }
        _cart.value = currentCart
        saveCart()
    }

    fun deleteFromCart(product: Product) {
        val currentCart = _cart.value.toMutableList()
        currentCart.removeAll { it.product.id == product.id }
        _cart.value = currentCart
        saveCart()
        showMessage("${product.name} removed from cart")
    }

    fun clearCart() {
        _cart.value = emptyList()
        saveCart()
    }

    fun checkout(onComplete: (Boolean) -> Unit) {
        viewModelScope.launch {
            try {
                val currentCart = _cart.value
                if (currentCart.isEmpty()) {
                    showMessage("Cart is empty")
                    onComplete(false)
                    return@launch
                }

                val db = com.google.firebase.firestore.FirebaseFirestore.getInstance()
                
                db.runTransaction { transaction ->
                    // 1. Perform ALL reads first
                    val productSnapshots = currentCart.map { item ->
                        val productRef = db.collection("products").document(item.product.id)
                        productRef to transaction.get(productRef)
                    }

                    // 2. Validate and then perform ALL writes
                    for (i in currentCart.indices) {
                        val item = currentCart[i]
                        val (productRef, snapshot) = productSnapshots[i]
                        
                        val currentStock = when (val s = snapshot.get("stock")) {
                            is Number -> s.toLong()
                            is String -> s.toLongOrNull() ?: 0L
                            else -> 0L
                        }
                        
                        if (currentStock >= item.quantity) {
                            transaction.update(productRef, "stock", currentStock - item.quantity)
                        } else {
                            throw Exception("Insufficient stock for ${item.product.name}")
                        }
                    }
                }.await()
                
                clearCart()
                showMessage("Checkout successful! Thank you.")
                onComplete(true)
            } catch (e: Exception) {
                android.util.Log.e("MainViewModel", "Checkout error", e)
                showMessage("Checkout failed: ${e.message}")
                onComplete(false)
            }
        }
    }

    fun updateProductRating(productId: String, newRating: Double) {
        if (productId.isBlank()) return

        // Update local state immediately for responsiveness
        val currentProducts = _products.value.toMutableList()
        val index = currentProducts.indexOfFirst { it.id == productId }
        if (index != -1) {
            currentProducts[index] = currentProducts[index].copy(rating = newRating)
            _products.value = currentProducts
        }

        viewModelScope.launch {
            try {
                val db = com.google.firebase.firestore.FirebaseFirestore.getInstance()
                db.collection("products").document(productId)
                    .update("rating", newRating)
                    .await()
                showMessage("Thank you for rating!")
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun toggleLike(product: Product) {
        val currentProducts = _products.value.toMutableList()
        val index = currentProducts.indexOfFirst { it.id == product.id }
        if (index != -1) {
            currentProducts[index] = product.copy(isLiked = !product.isLiked)
            _products.value = currentProducts
        }
    }

    fun updateLoginStatus() {
        _isLoggedIn.value = auth.currentUser != null
    }

    fun logout() {
        auth.signOut()
        updateLoginStatus()
        showMessage("Logged out")
    }

    fun signInWithGoogle(idToken: String, onResult: (Boolean) -> Unit) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    updateLoginStatus()
                    showMessage("Logged in with Google")
                    onResult(true)
                } else {
                    showMessage("Google login failed")
                    onResult(false)
                }
            }
    }
}
