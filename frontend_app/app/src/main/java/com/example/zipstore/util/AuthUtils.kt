package com.example.zipstore.util

import com.google.firebase.auth.FirebaseAuthException
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException
import com.google.firebase.auth.FirebaseAuthInvalidUserException
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.auth.FirebaseAuthWeakPasswordException

object AuthUtils {
    fun getReadableError(exception: Exception?): String {
        return when (exception) {
            is FirebaseAuthInvalidUserException -> "No account found with this email."
            is FirebaseAuthInvalidCredentialsException -> "Incorrect email or password."
            is FirebaseAuthUserCollisionException -> "An account already exists with this email."
            is FirebaseAuthWeakPasswordException -> "Password is too weak. Please use at least 6 characters."
            is FirebaseAuthException -> {
                when (exception.errorCode) {
                    "ERROR_NETWORK_REQUEST_FAILED" -> "Network error. Please check your internet connection."
                    "ERROR_TOO_MANY_REQUESTS" -> "Too many attempts. Please try again later."
                    else -> exception.message ?: "Authentication failed."
                }
            }
            else -> exception?.message ?: "An unexpected error occurred."
        }
    }
}
