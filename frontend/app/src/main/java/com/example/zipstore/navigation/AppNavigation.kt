package com.example.zipstore.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.zipstore.screens.CartScreen
import com.example.zipstore.screens.HomeScreen
import com.example.zipstore.screens.ProfileScreen
import com.example.zipstore.screens.SearchScreen
import com.example.zipstore.screens.LoginScreen
import com.example.zipstore.screens.RegisterScreen
import com.example.zipstore.screens.CheckoutScreen


@Composable
fun AppNavigation(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController()
){
    NavHost(
        navController = navController,
        startDestination = "login",
        modifier = modifier
    ) {
        composable ("login") { LoginScreen(navController) }
        composable ("register") { RegisterScreen(navController) }
        composable ("home") { HomeScreen(navController) }
        composable ("search") { SearchScreen(navController)  }
        composable ("cart") { CartScreen(navController) }
        composable ("checkout") { CheckoutScreen(navController) }
        composable ("profile") { ProfileScreen(navController) }
    }
}