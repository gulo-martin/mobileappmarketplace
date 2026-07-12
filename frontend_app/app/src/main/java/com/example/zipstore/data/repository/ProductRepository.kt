package com.example.zipstore.data.repository

import android.util.Log
import com.example.zipstore.data.model.Product
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class ProductRepository {
    private val firestore = FirebaseFirestore.getInstance()

    fun getProducts(): Flow<List<Product>> = callbackFlow {
        Log.d("ProductRepository", "getProducts() flow started")
        val listener = firestore.collection("products")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    Log.e("ProductRepository", "Firestore listener error", error)
                    trySend(emptyList())
                    return@addSnapshotListener
                }
                
                if (snapshot == null) {
                    Log.d("ProductRepository", "Snapshot is null")
                    trySend(emptyList())
                    return@addSnapshotListener
                }

                Log.d("ProductRepository", "Found ${snapshot.size()} documents in 'products' collection")
                
                val products = snapshot.documents.mapNotNull { doc ->
                    Log.d("ProductRepository", "Processing document: ${doc.id}, data: ${doc.data}")
                    try {
                        val p = doc.toObject(Product::class.java)
                        p?.apply { id = doc.id }
                    } catch (e: Exception) {
                        Log.e("ProductRepository", "Error mapping document ${doc.id}", e)
                        // Manual mapping fallback if toObject fails
                        try {
                            val data = doc.data
                            Product(
                                id = doc.id,
                                name = data?.get("name") as? String ?: data?.get("Name") as? String ?: "Unnamed",
                                price = when (val p = data?.get("price")) {
                                    is Number -> p.toDouble()
                                    is String -> p.toDoubleOrNull() ?: 0.0
                                    else -> 0.0
                                },
                                imageUrl = data?.get("imageUrl") as? String ?: data?.get("image_url") as? String ?: "",
                                image = data?.get("image") as? String ?: "",
                                images = (data?.get("images") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
                                category = data?.get("category") as? String ?: "Uncategorized",
                                rating = when (val r = data?.get("rating")) {
                                    is Number -> r.toDouble()
                                    is String -> r.toDoubleOrNull() ?: 0.0
                                    else -> 0.0
                                },
                                stock = when (val s = data?.get("stock")) {
                                    is Number -> s.toInt()
                                    is String -> s.toIntOrNull() ?: 0
                                    else -> 0
                                },
                                description = data?.get("description") as? String ?: "",
                                isActive = data?.get("isActive") as? Boolean ?: true,
                                createdAt = (data?.get("createdAt") as? Number)?.toLong() ?: 0L
                            )
                        } catch (e2: Exception) {
                            Log.e("ProductRepository", "Manual mapping also failed for ${doc.id}", e2)
                            null
                        }
                    }
                }
                
                Log.d("ProductRepository", "Emitting ${products.size} products")
                trySend(products)
            }
        awaitClose { listener.remove() }
    }

    fun getProductsByCategory(category: String): Flow<List<Product>> = callbackFlow {
        val listener = firestore.collection("products")
            .whereEqualTo("category", category)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    trySend(emptyList())
                    return@addSnapshotListener
                }
                val products = snapshot?.documents?.mapNotNull { doc ->
                    try {
                        doc.toObject(Product::class.java)?.apply { id = doc.id }
                    } catch (e: Exception) {
                        null
                    }
                } ?: emptyList()
                trySend(products)
            }
        awaitClose { listener.remove() }
    }
}
