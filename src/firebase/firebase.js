import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 * SECURITY NOTICE: Sensitive configuration (API keys, project IDs) must be
 * provided exclusively via environment variables (VITE_FIREBASE_*) and never hardcoded.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingConfigKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key]);

let app = null;
let auth = null;
let db = null;
let firebaseError = null;

try {
  if (missingConfigKeys.length > 0) {
    throw new Error(`Missing Firebase config keys: ${missingConfigKeys.join(', ')}`);
  }

  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  firebaseError = error;
  console.error('Firebase initialization error:', error.message);
  app = null;
  auth = null;
  db = null;
}

export { auth, db, firebaseError };
export default app;
