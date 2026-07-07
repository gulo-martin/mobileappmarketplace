package com.example.zipstore.data.model

data class Product(
    var id: String = "",
    var name: String = "",
    var description: String = "",
    var price: Double = 0.0,
    var imageUrl: String = "",
    var category: String = "",
    var rating: Double = 0.0,
    var isLiked: Boolean = false
)
