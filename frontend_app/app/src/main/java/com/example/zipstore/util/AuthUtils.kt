package com.example.zipstore.util

import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuthException
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException
import com.google.firebase.auth.FirebaseAuthInvalidUserException
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.auth.FirebaseAuthWeakPasswordException
import androidx.credentials.exceptions.GetCredentialException

object AuthUtils {
    fun getReadableError(exception: Exception?): String {
        return when (exception) {
            is FirebaseAuthInvalidUserException -> "No account found with this email."
            is FirebaseAuthInvalidCredentialsException -> "Incorrect email or password."
            is FirebaseAuthUserCollisionException -> "An account already exists with this email."
            is FirebaseAuthWeakPasswordException -> "Password is too weak. Please use at least 6 characters."
            is FirebaseException -> {
                if (exception.message?.contains("DEVELOPER_ERROR") == true) {
                    "Google Sign-In configuration error. Please check SHA-1 in Firebase Console."
                } else {
                    exception.message ?: "Firebase error occurred."
                }
            }
            is GetCredentialException -> {
                when {
                    exception.message?.contains("No acceptable module") == true -> "Google Play Services is updating or missing."
                    exception.message?.contains("DEVELOPER_ERROR") == true -> "Configuration error. Check your SHA-1 and Client ID."
                    else -> "Google Sign-In failed: ${exception.message}"
                }
            }
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
