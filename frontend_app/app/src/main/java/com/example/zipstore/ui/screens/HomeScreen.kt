package com.example.zipstore.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.example.zipstore.data.model.Product
import com.example.zipstore.ui.MainViewModel
import com.example.zipstore.ui.navigation.Screen
import java.util.Locale
import java.text.NumberFormat

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController, viewModel: MainViewModel) {
    val products by viewModel.products.collectAsState()
    val cartItems by viewModel.cart.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("ZipStore", fontWeight = FontWeight.Bold) },
                actions = {
                    val cartCount = cartItems.sumOf { it.quantity }
                    BadgedBox(
                        badge = {
                            if (cartCount > 0) {
                                Badge(
                                    containerColor = MaterialTheme.colorScheme.primary,
                                    contentColor = Color.White
                                ) {
                                    Text(cartCount.toString())
                                }
                            }
                        },
                        modifier = Modifier.padding(end = 16.dp)
                    ) {
                        IconButton(onClick = { navController.navigate(Screen.Cart.route) }) {
                            Icon(Icons.Default.ShoppingCart, contentDescription = "Cart")
                        }
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navController.navigate(Screen.Shopping.route) },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = Color.White)
            }
        }
    ) { padding ->
        if (products.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(8.dp),
                modifier = Modifier.padding(padding)
            ) {
                item(span = { GridItemSpan(2) }) {
                    WelcomeBanner()
                }

                item(span = { GridItemSpan(2) }) {
                    Text(
                        "Popular Products",
                        modifier = Modifier.padding(16.dp),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                }

                items(products) { product ->
                    ProductItem(
                        product = product,
                        onProductClick = {
                            navController.navigate(Screen.ProductDetails.createRoute(product.id))
                        },
                        onAddToCart = { viewModel.addToCart(product) },
                        onLikeClick = { viewModel.toggleLike(product) }
                    )
                }
            }
        }
    }
}

@Composable
fun WelcomeBanner() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp)
            .padding(8.dp),
        shape = MaterialTheme.shapes.extraLarge,
        elevation = CardDefaults.cardElevation(8.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Image(
                painter = painterResource(id = com.example.zipstore.R.drawable.product),
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            // Dark overlay for text readability
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(
                                Color.Black.copy(alpha = 0.7f),
                                Color.Transparent
                            )
                        )
                    )
            )

            Column(
                verticalArrangement = Arrangement.Center,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 24.dp)
            ) {
                Text(
                    text = "Welcome to\nZipStore!",
                    style = MaterialTheme.typography.headlineLarge,
                    color = Color.White,
                    fontWeight = FontWeight.ExtraBold,
                    lineHeight = 36.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Quality products at your doorstep.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = Color.White.copy(alpha = 0.9f),
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

fun formatPrice(price: Double): String {
    val formatter = NumberFormat.getInstance(Locale.US)
    return "MWK ${formatter.format(price)}"
}

@Composable
fun ProductItem(
    product: Product,
    onProductClick: () -> Unit,
    onAddToCart: () -> Unit,
    onLikeClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth()
            .clickable { onProductClick() },
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column {
            Box {
                AsyncImage(
                    model = product.imageUrl.takeIf { it.isNotBlank() } ?: com.example.zipstore.R.drawable.product,
                    contentDescription = product.name,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp),
                    contentScale = ContentScale.Crop,
                    error = painterResource(id = com.example.zipstore.R.drawable.logo),
                    placeholder = painterResource(id = com.example.zipstore.R.drawable.logo)
                )
                IconButton(
                    onClick = onLikeClick,
                    modifier = Modifier.align(Alignment.TopEnd)
                ) {
                    Icon(
                        if (product.isLiked) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Like",
                        tint = if (product.isLiked) Color.Red else Color.Gray
                    )
                }
            }
            Column(modifier = Modifier.padding(8.dp)) {
                Text(product.name, fontWeight = FontWeight.Bold, maxLines = 1)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Star,
                        contentDescription = null,
                        tint = Color(0xFFFFB300),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = product.rating.toString(),
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray
                    )
                }
                Text(formatPrice(product.price), color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = onAddToCart,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                    shape = MaterialTheme.shapes.medium
                ) {
                    Text("Add to Cart", fontSize = 12.sp)
                }
            }
        }
    }
}
