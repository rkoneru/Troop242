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
 * 6. Replace the firebaseConfig object below with your credentials
 * 7. Set environment variables: VITE_FIREBASE_API_KEY, etc.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

let app;
let auth;
let db;

try {
  // Only initialize Firebase if config is complete
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn('Firebase config is incomplete. Public pages will work without authentication.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error.message);
}

export { auth, db };
export default app;
