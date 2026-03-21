import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 * Public config - security is enforced by Firestore rules
 */

const firebaseConfig = {
  apiKey: 'AIzaSyCNJks9cgCJ_08Bcg4mrYrXOc4Jg9vyp7s',
  authDomain: 'troop242-54e6a.firebaseapp.com',
  projectId: 'troop242-54e6a',
  storageBucket: 'troop242-54e6a.firebasestorage.app',
  messagingSenderId: '1059763099338',
  appId: '1:1059763099338:web:7ba32ca6d62bb6cec80633'
};

let app = null;
let auth = null;
let db = null;
let firebaseError = null;

try {
  console.log('🔥 Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  firebaseError = error;
  console.error('❌ Firebase initialization error:', error.message);
  app = null;
  auth = null;
  db = null;
}

export { auth, db, firebaseError };
export default app;
