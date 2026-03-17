import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export default function RegisterWithInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('code');

  const [step, setStep] = useState('verify'); // verify, register, success
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Verify invitation code
  const verifyInvite = async () => {
    if (!inviteCode) {
      setError('No invitation code provided');
      return;
    }

    setLoading(true);
    try {
      // Search for invitation by code
      const invitationsRef = db.collection('invitations');
      const snapshot = await invitationsRef.where('code', '==', inviteCode.toUpperCase()).get();

      if (snapshot.empty) {
        setError('Invalid or expired invitation code');
        setLoading(false);
        return;
      }

      const invite = snapshot.docs[0].data();

      // Check if expired
      if (new Date(invite.expiresAt) < new Date()) {
        setError('This invitation has expired');
        setLoading(false);
        return;
      }

      // Check if already used
      if (invite.status !== 'pending') {
        setError('This invitation has already been used');
        setLoading(false);
        return;
      }

      setInviteData({ ...invite, inviteId: snapshot.docs[0].id });
      setStep('register');
    } catch (err) {
      setError('Error verifying invitation: ' + err.message);
    }
    setLoading(false);
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, inviteData.email, password);
      const user = userCredential.user;

      // Create Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: inviteData.email,
        name,
        role: inviteData.role,
        status: 'approved',
        password, // Fallback for Firestore login
        joinDate: new Date().toISOString(),
        phone: '',
        createdAt: new Date().toISOString()
      });

      // Mark invitation as used
      await db.collection('invitations').doc(inviteData.inviteId).update({
        status: 'accepted',
        usedBy: user.uid,
        usedAt: new Date().toISOString()
      });

      setStep('success');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered');
      } else {
        setError('Registration failed: ' + err.message);
      }
    }

    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <section className="hero-page section" style={{ minHeight: '40vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>🎉 Join Troop 242</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Create your account with your invitation code
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section section--dark">
        <div className="container" style={{ maxWidth: '500px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: 40 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: 12,
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 8,
                  color: '#ef4444',
                  marginBottom: 24,
                  fontSize: '0.9rem'
                }}
              >
                ✕ {error}
              </motion.div>
            )}

            {/* Step 1: Verify Code */}
            {step === 'verify' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 style={{ marginBottom: 24, textAlign: 'center' }}>Enter Invitation Code</h2>
                <input
                  type="text"
                  placeholder="XXXXXXXX"
                  defaultValue={inviteCode || ''}
                  onChange={(e) => {
                    const input = e.target;
                    if (input.value.length === 8) {
                      window.location.search = `?code=${input.value.toUpperCase()}`;
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: 8,
                    color: 'var(--text-primary)',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '4px',
                    fontFamily: 'monospace',
                    marginBottom: 24
                  }}
                />
                <button
                  onClick={verifyInvite}
                  disabled={!inviteCode || loading}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: inviteCode ? 'linear-gradient(135deg, var(--bg-secondary), var(--accent))' : 'rgba(100, 100, 100, 0.3)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: inviteCode ? 'pointer' : 'not-allowed',
                    fontSize: '1rem',
                    opacity: inviteCode ? 1 : 0.5
                  }}
                >
                  {loading ? '⏳ Verifying...' : 'Continue'}
                </button>
              </motion.div>
            )}

            {/* Step 2: Register */}
            {step === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 style={{ marginBottom: 8, textAlign: 'center' }}>Create Your Account</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 24 }}>
                  {inviteData?.email} • {inviteData?.role === 'leader' ? '👔 Leader' : '🧭 Scout'}
                </p>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
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
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? '⏳ Creating account...' : 'Create Account'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                <h2 style={{ marginBottom: 8 }}>Welcome!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                  Your account has been created successfully!
                </p>
                <button
                  onClick={() => navigate('/member-login')}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, var(--bg-secondary), var(--accent))',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Go to Login
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
