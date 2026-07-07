package com.example.zipstore.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.zipstore.data.model.CartItem
import com.example.zipstore.data.model.Product
import com.example.zipstore.data.repository.ProductRepository
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {
    private val repository = ProductRepository()
    private val auth = FirebaseAuth.getInstance()

    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    val cart: StateFlow<List<CartItem>> = _cart.asStateFlow()

    private val _isLoggedIn = MutableStateFlow(auth.currentUser != null)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    init {
        fetchProducts()
    }

    private fun fetchProducts() {
        viewModelScope.launch {
            repository.getProducts().collect {
                _products.value = it
            }
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
    }

    fun clearCart() {
        _cart.value = emptyList()
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
    }
}
