package com.example.zipstore.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun GoogleIcon() {
    Surface(
        modifier = Modifier.size(24.dp),
        shape = MaterialTheme.shapes.small,
        color = Color.White,
        border = BorderStroke(1.dp, Color.LightGray)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                "G",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = Color(0xFF4285F4)
            )
        }
    }
}
