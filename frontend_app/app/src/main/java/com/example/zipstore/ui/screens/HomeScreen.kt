package com.example.zipstore.ui.screens

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
import com.example.zipstore.ui.components.ZipStoreImage
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.ui.draw.clip
import com.example.zipstore.data.model.Product
import com.example.zipstore.ui.MainViewModel
import com.example.zipstore.ui.navigation.Screen
import java.util.Locale
import java.text.NumberFormat

import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items as lazyRowItems
import androidx.compose.runtime.LaunchedEffect
import kotlinx.coroutines.delay

data class BannerItem(
    val title: String,
    val description: String,
    val imageRes: Int,
    val backgroundColor: Color
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController, viewModel: MainViewModel) {
    val products by viewModel.products.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val cartItems by viewModel.cart.collectAsState()

    val banners = listOf(
        BannerItem(
            "Welcome to\nZipStore!",
            "Quality products at your doorstep.",
            com.example.zipstore.R.drawable.product,
            MaterialTheme.colorScheme.primary
        ),
        BannerItem(
            "Exclusive\nDeals!",
            "Up to 50% off on electronics.",
            com.example.zipstore.R.drawable.product2,
            Color(0xFFE91E63)
        ),
        BannerItem(
            "New\nArrivals!",
            "Check out the latest fashion trends.",
            com.example.zipstore.R.drawable.product3,
            Color(0xFF4CAF50)
        )
    )

    Scaffold(
        topBar = {
            TopAppBar(
                modifier = Modifier.fillMaxWidth(),
                title = { Text("ZipStore", fontWeight = FontWeight.Bold, color = Color.White) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary
                ),
                actions = {
                    val cartCount = cartItems.sumOf { it.quantity }
                    
                    IconButton(onClick = { navController.navigate(Screen.Shopping.route) }) {
                        Icon(
                            Icons.Default.Search,
                            contentDescription = "Search",
                            tint = Color.White
                        )
                    }

                    BadgedBox(
                        badge = {
                            if (cartCount > 0) {
                                Badge(
                                    containerColor = Color.White,
                                    contentColor = MaterialTheme.colorScheme.primary
                                ) {
                                    Text(cartCount.toString())
                                }
                            }
                        },
                        modifier = Modifier.padding(end = 16.dp)
                    ) {
                        IconButton(onClick = { navController.navigate(Screen.Cart.route) }) {
                            Icon(
                                Icons.Default.ShoppingCart,
                                contentDescription = "Cart",
                                tint = Color.White
                            )
                        }
                    }
                }
            )
        }
    ) { padding ->
        val popularProducts = products.filter { it.rating >= 4.0 }.take(4)
        val newArrivals = products.sortedByDescending { it.createdAt }.take(6)
        val productsByCategory = products.groupBy { it.category }

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(8.dp),
            modifier = Modifier.padding(padding)
        ) {
            item(span = { GridItemSpan(2) }) {
                BannerCarousel(banners)
            }

            if (newArrivals.isNotEmpty()) {
                item(span = { GridItemSpan(2) }) {
                    Column {
                        Text(
                            "New Arrivals",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 8.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            lazyRowItems(newArrivals) { product ->
                                Box(modifier = Modifier.width(180.dp)) {
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

            if (isLoading) {
                item(span = { GridItemSpan(2) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }
            } else if (products.isEmpty()) {
                item(span = { GridItemSpan(2) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.Info, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(48.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("No products found", color = Color.Gray)
                        }
                    }
                }
            } else {
                if (popularProducts.isNotEmpty()) {
                    item(span = { GridItemSpan(2) }) {
                        Text(
                            "Popular Products",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    items(popularProducts) { product ->
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

                productsByCategory.forEach { (category, categoryProducts) ->
                    item(span = { GridItemSpan(2) }) {
                        Text(
                            text = category.replaceFirstChar { it.uppercase() },
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    items(categoryProducts) { product ->
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

@Composable
fun BannerCarousel(banners: List<BannerItem>) {
    val pagerState = rememberPagerState(pageCount = { banners.size })
    
    LaunchedEffect(pagerState.currentPage) {
        delay(5000)
        val nextPage = (pagerState.currentPage + 1) % banners.size
        pagerState.animateScrollToPage(nextPage)
    }

    Column {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .padding(8.dp)
        ) { page ->
            BannerCard(banners[page])
        }
        
        Row(
            Modifier
                .height(16.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            repeat(banners.size) { iteration ->
                val color = if (pagerState.currentPage == iteration) Color.DarkGray else Color.LightGray
                Box(
                    modifier = Modifier
                        .padding(2.dp)
                        .clip(CircleShape)
                        .background(color)
                        .size(8.dp)
                )
            }
        }
    }
}

@Composable
fun BannerCard(banner: BannerItem) {
    Card(
        modifier = Modifier.fillMaxSize(),
        shape = MaterialTheme.shapes.small,
        elevation = CardDefaults.cardElevation(5.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Image(
                painter = painterResource(id = banner.imageRes),
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(
                                banner.backgroundColor.copy(alpha = 0.8f),
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
                    text = banner.title,
                    style = MaterialTheme.typography.headlineLarge,
                    color = Color.White,
                    fontWeight = FontWeight.ExtraBold,
                    lineHeight = 36.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = banner.description,
                    style = MaterialTheme.typography.bodyLarge,
                    color = Color.White.copy(alpha = 0.9f),
                    fontWeight = FontWeight.Medium
                )
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
        shape = MaterialTheme.shapes.small,
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
        elevation = CardDefaults.cardElevation(2.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column {
            Box {
                ZipStoreImage(
                    url = product.displayImage,
                    contentDescription = product.name,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp)
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
                Text(product.name, fontWeight = FontWeight.Bold, maxLines = 1, color = Color.Black)
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
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        formatPrice(product.price),
                        color = Color.Black,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(
                        onClick = onAddToCart,
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            Icons.Default.AddShoppingCart,
                            contentDescription = "Add to cart",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }
    }
}
