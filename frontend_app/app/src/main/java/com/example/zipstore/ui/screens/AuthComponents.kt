package com.example.zipstore.ui.screens

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.sp

@Composable
fun GoogleIcon() {
    val googleG = buildAnnotatedString {
        withStyle(style = SpanStyle(color = Color(0xFF4285F4))) { append("G") }
        withStyle(style = SpanStyle(color = Color(0xFFEA4335))) { append("o") }
        withStyle(style = SpanStyle(color = Color(0xFFFBBC05))) { append("o") }
        withStyle(style = SpanStyle(color = Color(0xFF4285F4))) { append("g") }
        withStyle(style = SpanStyle(color = Color(0xFF34A853))) { append("l") }
        withStyle(style = SpanStyle(color = Color(0xFFEA4335))) { append("e") }
    }
    Text(
        text = googleG,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp
    )
}
