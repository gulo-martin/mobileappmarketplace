package com.example.zipstore.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.zipstore.ui.MainViewModel
import com.example.zipstore.ui.screens.*

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Home : Screen("home")
    object Login : Screen("login")
    object Registration : Screen("registration")
    object Cart : Screen("cart")
    object Profile : Screen("profile")
    object ProductDetails : Screen("product_details/{productId}") {
        fun createRoute(productId: String) = "product_details/$productId"
    }
    object Shopping : Screen("shopping")
    object Checkout : Screen("checkout")
}

@Composable
fun ZipStoreNavGraph(
    navController: NavHostController,
    viewModel: MainViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route // User said "when the app launches it should first go to the home screen"
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
