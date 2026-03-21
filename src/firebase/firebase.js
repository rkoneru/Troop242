import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 *
 * Public config - security is enforced by Firestore rules
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCNJks9cgCJ_08Bcg4mrYrXOc4Jg9vyp7s',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'troop242-54e6a.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'troop242-54e6a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'troop242-54e6a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1059763099338',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1059763099338:web:7ba32ca6d62bb6cec80633'
};

let app = null;
let auth = null;
let db = null;
let firebaseError = null;

try {
  console.log('Firebase config:', {
    apiKey: firebaseConfig.apiKey ? '***' : 'missing',
    projectId: firebaseConfig.projectId || 'missing'
  });

  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log('✅ Firebase initialized successfully');
    } catch (initError) {
      firebaseError = initError;
      console.error('❌ Firebase initialization error:', initError.message);
      console.error('Code:', initError.code);
      app = null;
      auth = null;
      db = null;
    }
  } else {
    console.warn('⚠️ Firebase config is incomplete. Public pages will work without authentication.');
  }
} catch (error) {
  firebaseError = error;
  console.error('❌ Failed to initialize Firebase:', error.message);
}

export { auth, db, firebaseError };
export default app;
