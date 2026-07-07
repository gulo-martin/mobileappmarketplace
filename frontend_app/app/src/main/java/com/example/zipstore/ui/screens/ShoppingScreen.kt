package com.example.zipstore.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.zipstore.ui.MainViewModel
import com.example.zipstore.ui.navigation.Screen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShoppingScreen(navController: NavController, viewModel: MainViewModel) {
    val products by viewModel.products.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    
    val filteredProducts = products.filter { 
        it.name.contains(searchQuery, ignoreCase = true) || it.category.contains(searchQuery, ignoreCase = true)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Search products...") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(end = 16.dp),
                        singleLine = true,
                        shape = MaterialTheme.shapes.extraLarge,
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) }
                    )
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            if (filteredProducts.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No products found")
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(8.dp)
                ) {
                    items(filteredProducts) { product ->
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
}
