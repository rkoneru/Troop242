
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import '../styles/member-login.css';

export default function MemberLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    // Check if Firebase is properly configured
    if (!auth || !db) {
      setError('Firebase is not properly configured. Please check your environment variables.');
      return;
    }

    setLoading(true);

    try {
      let user = null;
      let userProfile = null;

      // Use Firebase Auth for all authentication (secure, hashed passwords)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        const profileSnap = await getDoc(doc(db, 'users', user.uid));
        userProfile = profileSnap.data();
      } catch (authError) {
        // Handle Firebase Auth errors with a generic message to prevent email enumeration
        const genericError = 'Invalid email or password';
        if (
          authError.code === 'auth/user-not-found' ||
          authError.code === 'auth/wrong-password' ||
          authError.code === 'auth/invalid-email' ||
          authError.code === 'auth/user-disabled' ||
          authError.code === 'auth/invalid-credential'
        ) {
          throw new Error(genericError);
        }
        throw authError;
      }

      if (!user) {
        throw new Error('Authentication failed');
      }

      // Get user profile from Firestore if not already loaded
      if (!userProfile) {
        const profileSnap = await getDoc(doc(db, 'users', user.uid));
        userProfile = profileSnap.data();
      }

      if (!userProfile) {
        setError('User profile not found in database');
        setLoading(false);
        return;
      }

      // Redirect based on role
      const redirectMap = {
        scout: '/scout-dashboard',
        leader: '/leader-dashboard',
        admin: '/admin-dashboard'
      };

      const redirectPath = redirectMap[userProfile.role] || '/';
      navigate(redirectPath);
    } catch (err) {
      let errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="hero-page section" style={{ minHeight: '30vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>👥 Member Login</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Sign in to your Troop 242 account
            </p>
          </motion.div>
        </div>
      </section>

      {/* Login Form */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: '450px',
              margin: '0 auto',
              padding: 40,
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 16,
              backdropFilter: 'blur(12px)'
            }}
            className="glass-card"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: 12,
                  background: 'rgba(255, 100, 100, 0.1)',
                  border: '1px solid rgba(255, 100, 100, 0.3)',
                  borderRadius: 8,
                  color: '#ff6464',
                  fontSize: '0.85rem',
                  marginBottom: 24
                }}
              >
                ✕ {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: 8,
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(100, 150, 200, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--input-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: 8,
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(100, 150, 200, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--input-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--accent))',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  marginTop: 8,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 16px rgba(100, 150, 200, 0.2)',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 6px 24px rgba(100, 150, 200, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 4px 16px rgba(100, 150, 200, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? '⏳ Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--divider)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 12 }}>
                Don't have an account?
              </p>
              <a
                href="/register?code=SCOUT01"
                style={{
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-bright)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--accent)'}
              >
                Register as a Scout →
              </a>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ maxWidth: '700px', margin: '0 auto' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Member Portal Information</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              <div style={{ padding: 24, background: 'var(--glass-bg)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: 12 }}>🔒 Security</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  All accounts are secured with encryption and require two-factor authentication for sensitive operations.
                </p>
              </div>

              <div style={{ padding: 24, background: 'var(--glass-bg)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: 12 }}>📱 Mobile Friendly</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Access your account from any device. The member portal is fully responsive and works on all screens.
                </p>
              </div>

              <div style={{ padding: 24, background: 'var(--glass-bg)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: 12 }}>💬 Support</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Need help? Contact our support team at troop242sanford@gmail.com or call on Tuesday at 7:00 PM.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
