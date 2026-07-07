package com.example.zipstore.data.repository

import com.example.zipstore.data.model.Product
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class ProductRepository {
    private val firestore = FirebaseFirestore.getInstance()

    fun getProducts(): Flow<List<Product>> = flow {
        try {
            val snapshot = firestore.collection("products").get().await()
            val products = snapshot.toObjects(Product::class.java)
            emit(products)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    fun getProductsByCategory(category: String): Flow<List<Product>> = flow {
        try {
            val snapshot = firestore.collection("products")
                .whereEqualTo("category", category)
                .get().await()
            val products = snapshot.toObjects(Product::class.java)
            emit(products)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }
}
