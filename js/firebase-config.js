/**
 * HAVEN - Firebase Configuration
 * Initializes Firebase and exports necessary services
 */

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
// These values should be replaced with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✓ Firebase initialized successfully');
} catch (error) {
    console.error('✗ Firebase initialization error:', error);
}

// Export Firestore instance
export { db };

// Export Firebase app instance
export { app };

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Register a web app in your Firebase project
 * 3. Copy the Firebase configuration values
 * 4. Create a .env file in the root directory with:
 *    VITE_FIREBASE_API_KEY=your_api_key
 *    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
 *    VITE_FIREBASE_PROJECT_ID=your_project_id
 *    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
 *    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
 *    VITE_FIREBASE_APP_ID=your_app_id
 * 5. Enable Firestore Database in Firebase Console
 * 6. Set up security rules (see firestore.rules file)
 * 
 * For production deployment on Hostinger:
 * - Set environment variables in your hosting configuration
 * - OR replace the placeholder values above with your actual credentials
 *   (Note: API keys are safe to expose for Firebase Web SDK)
 */
