import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 * Public config - security is enforced by Firestore rules
 */

const fallbackFirebaseConfig = {
  apiKey: 'AIzaSyCNJks9cgCJ_08Bcg4mrYrXOc4Jg9vyp7s',
  authDomain: 'troop242-54e6a.firebaseapp.com',
  projectId: 'troop242-54e6a',
  storageBucket: 'troop242-54e6a.firebasestorage.app',
  messagingSenderId: '1059763099338',
  appId: '1:1059763099338:web:7ba32ca6d62bb6cec80633'
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackFirebaseConfig.appId
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
