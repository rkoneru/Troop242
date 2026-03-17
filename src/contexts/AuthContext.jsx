import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);           // Firebase user object
  const [profile, setProfile] = useState(null);     // Firestore user profile doc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          // Load user profile from Firestore
          try {
            const profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (profileSnap.exists()) {
              setProfile({
                uid: firebaseUser.uid,
                ...profileSnap.data()
              });
            } else {
              // User document doesn't exist in Firestore yet
              setProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                role: 'scout' // default role
              });
            }
          } catch (err) {
            console.error('Error loading user profile:', err);
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'scout'
            });
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setError(null);
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
