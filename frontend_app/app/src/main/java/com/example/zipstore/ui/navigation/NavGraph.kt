package com.example.zipstore.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.zipstore.ui.MainViewModel
import com.example.zipstore.ui.screens.*

sealed class Screen(val route: String, val title: String? = null, val icon: ImageVector? = null) {
    object Splash : Screen("splash")
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Login : Screen("login")
    object Registration : Screen("registration")
    object Cart : Screen("cart", "Cart", Icons.Default.ShoppingCart)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)
    object ProductDetails : Screen("product_details/{productId}") {
        fun createRoute(productId: String) = "product_details/$productId"
    }
    object Shopping : Screen("shopping")
    object Checkout : Screen("checkout")
}

val bottomNavItems = listOf(
    Screen.Home,
    Screen.Cart,
    Screen.Profile
)

@Composable
fun ZipStoreNavGraph(
    navController: NavHostController,
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route,
        modifier = modifier
    ) {
        composable(Screen.Splash.route) { SplashScreen(navController) }
        composable(Screen.Home.route) { HomeScreen(navController, viewModel) }
        composable(Screen.Login.route) { LoginScreen(navController, viewModel) }
        composable(Screen.Registration.route) { RegistrationScreen(navController, viewModel) }
        composable(Screen.Cart.route) { CartScreen(navController, viewModel) }
        composable(Screen.Profile.route) { ProfileScreen(navController, viewModel) }
        composable(Screen.ProductDetails.route) { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId") ?: ""
            ProductDetailsScreen(navController, viewModel, productId)
        }
        composable(Screen.Shopping.route) { ShoppingScreen(navController, viewModel) }
        composable(Screen.Checkout.route) { CheckoutScreen(navController, viewModel) }
    }
}
