package com.example.zipstore.data.model

data class CartItem(
    var product: Product = Product(),
    var quantity: Int = 1
)
