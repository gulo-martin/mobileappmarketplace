package com.example.zipstore.data.model

import androidx.annotation.Keep
import com.google.firebase.firestore.Exclude
import com.google.firebase.firestore.IgnoreExtraProperties

@Keep
@IgnoreExtraProperties
data class Product(
    var id: String = "",
    var name: String = "",
    var description: String = "",
    var price: Double = 0.0,
    var category: String = "",
    var rating: Double = 0.0,
    var stock: Int = 0,
    var isActive: Boolean = true,
    var imageUrl: String = "",
    var image: String = "",
    var images: List<String> = emptyList(),
    var createdAt: Long = 0,
    var isLiked: Boolean = false
) {
    @get:Exclude
    val displayImage: String
        get() = when {
            imageUrl.isNotBlank() -> imageUrl
            image.isNotBlank() -> image
            images.isNotEmpty() && images.first().isNotBlank() -> images.first()
            else -> ""
        }
}
