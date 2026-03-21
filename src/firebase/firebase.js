import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 *
 * To use Firebase with this app:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (or use an existing one)
 * 3. Enable Email/Password authentication (Auth → Sign-in method → Email/Password)
 * 4. Create a Firestore database (Firestore → Create database)
 * 5. Copy your config object from Project settings → General tab
 * 6. Set environment variables: VITE_FIREBASE_API_KEY, etc.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

let app = null;
let auth = null;
let db = null;
let firebaseError = null;

try {
  // Only initialize Firebase if config is complete
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log('Firebase initialized successfully');
    } catch (initError) {
      firebaseError = initError;
      console.error('Firebase initialization error:', initError.message);
      console.error('Code:', initError.code);
      // Reset to null so app works without Firebase
      app = null;
      auth = null;
      db = null;
    }
  } else {
    console.warn('Firebase config is incomplete. Public pages will work without authentication.');
  }
} catch (error) {
  firebaseError = error;
  console.error('Failed to initialize Firebase:', error.message);
}

// Export with null-safe defaults
export { auth, db, firebaseError };
export default app;
