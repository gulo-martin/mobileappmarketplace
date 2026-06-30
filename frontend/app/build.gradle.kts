plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.zipstore"
<<<<<<< HEAD
    compileSdk = 37
=======
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }
>>>>>>> 3953e2bd54091e16e58e1bbacf10539b9b0016b4

    defaultConfig {
        applicationId = "com.example.zipstore"
        minSdk = 24
<<<<<<< HEAD
        targetSdk = 37
=======
        targetSdk = 36
>>>>>>> 3953e2bd54091e16e58e1bbacf10539b9b0016b4
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            optimization {
                enable = false
            }
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        compose = true
<<<<<<< HEAD
        viewBinding = true
=======
>>>>>>> 3953e2bd54091e16e58e1bbacf10539b9b0016b4
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.activity.compose)
<<<<<<< HEAD
    implementation(libs.androidx.activity.ktx)
    implementation(libs.androidx.annotation)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.compose.material3)
    implementation("androidx.compose.material:material-icons-extended")
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.livedata.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.material)
=======
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
>>>>>>> 3953e2bd54091e16e58e1bbacf10539b9b0016b4
    testImplementation(libs.junit)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(libs.androidx.junit)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
    debugImplementation(libs.androidx.compose.ui.tooling)
<<<<<<< HEAD
    implementation("androidx.navigation:navigation-compose:2.9.8")
=======
>>>>>>> 3953e2bd54091e16e58e1bbacf10539b9b0016b4
}