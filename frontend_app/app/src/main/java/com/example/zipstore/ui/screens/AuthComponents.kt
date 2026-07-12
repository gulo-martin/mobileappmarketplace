package com.example.zipstore.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.unit.dp

@Composable
fun GoogleLogo() {
    // A more accurate "G" logo drawn with Canvas
    Box(
        modifier = Modifier
            .size(20.dp)
            .background(Color.White, CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val width = size.width
            val height = size.height
            
            // Draw Blue section
            drawPath(
                path = Path().apply {
                    moveTo(width * 0.95f, height * 0.52f)
                    cubicTo(width * 0.95f, height * 0.48f, width * 0.94f, height * 0.44f, width * 0.93f, height * 0.41f)
                    lineTo(width * 0.5f, height * 0.41f)
                    lineTo(width * 0.5f, height * 0.58f)
                    lineTo(width * 0.76f, height * 0.58f)
                    cubicTo(width * 0.75f, height * 0.67f, width * 0.70f, height * 0.74f, width * 0.62f, height * 0.79f)
                    lineTo(width * 0.62f, height * 0.89f)
                    lineTo(width * 0.84f, height * 0.89f)
                    cubicTo(width * 0.95f, height * 0.78f, width * 1.02f, height * 0.62f, width * 0.95f, height * 0.52f)
                },
                color = Color(0xFF4285F4),
                style = Fill
            )
            
            // Draw Green section
            drawPath(
                path = Path().apply {
                    moveTo(width * 0.5f, height * 1.0f)
                    cubicTo(width * 0.64f, height * 1.0f, width * 0.76f, height * 0.95f, width * 0.84f, height * 0.89f)
                    lineTo(width * 0.62f, height * 0.79f)
                    cubicTo(width * 0.59f, height * 0.81f, width * 0.55f, height * 0.83f, width * 0.5f, height * 0.83f)
                    cubicTo(width * 0.41f, height * 0.83f, width * 0.33f, height * 0.77f, width * 0.30f, height * 0.69f)
                    lineTo(width * 0.08f, height * 0.69f)
                    lineTo(width * 0.08f, height * 0.86f)
                    cubicTo(width * 0.17f, height * 0.96f, width * 0.33f, height * 1.0f, width * 0.5f, height * 1.0f)
                },
                color = Color(0xFF34A853),
                style = Fill
            )
            
            // Draw Yellow section
            drawPath(
                path = Path().apply {
                    moveTo(width * 0.30f, height * 0.69f)
                    cubicTo(width * 0.28f, height * 0.65f, width * 0.27f, height * 0.60f, width * 0.27f, height * 0.5f)
                    cubicTo(width * 0.27f, height * 0.40f, width * 0.28f, height * 0.35f, width * 0.30f, height * 0.31f)
                    lineTo(width * 0.08f, height * 0.31f)
                    cubicTo(width * 0.03f, height * 0.42f, width * 0.03f, height * 0.58f, width * 0.08f, height * 0.69f)
                    lineTo(width * 0.30f, height * 0.69f)
                },
                color = Color(0xFFFBBC05),
                style = Fill
            )
            
            // Draw Red section
            drawPath(
                path = Path().apply {
                    moveTo(width * 0.5f, height * 0.17f)
                    cubicTo(width * 0.57f, height * 0.17f, width * 0.63f, height * 0.19f, width * 0.68f, height * 0.24f)
                    lineTo(width * 0.85f, height * 0.07f)
                    cubicTo(width * 0.76f, height * -0.02f, width * 0.64f, height * 0.0f, width * 0.5f, height * 0.0f)
                    cubicTo(width * 0.33f, height * 0.0f, width * 0.17f, height * 0.10f, width * 0.08f, height * 0.31f)
                    lineTo(width * 0.30f, height * 0.31f)
                    cubicTo(width * 0.33f, height * 0.23f, width * 0.41f, height * 0.17f, width * 0.5f, height * 0.17f)
                },
                color = Color(0xFFEA4335),
                style = Fill
            )
        }
    }
}

@Composable
fun FormErrorText(error: String) {
    if (error.isNotEmpty()) {
        Text(
            text = error,
            color = MaterialTheme.colorScheme.error,
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 4.dp, top = 4.dp)
        )
    }
}

@Composable
fun AuthProgressBar(text: String) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.3f)),
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = MaterialTheme.shapes.large,
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(8.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.height(16.dp))
                Text(text, style = MaterialTheme.typography.titleMedium)
            }
        }
    }
}
