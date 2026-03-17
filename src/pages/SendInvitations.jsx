import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Copy, Check } from 'lucide-react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function SendInvitations() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [inviteType, setInviteType] = useState('scout');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Check authorization
  useEffect(() => {
    if (loading) return;
    if (!user || !['leader', 'admin'].includes(profile?.role)) {
      navigate('/member-login');
    }
  }, [user, profile, loading, navigate]);

  // Load invitations
  useEffect(() => {
    if (!user) return;
    const loadInvitations = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'invitations'), where('createdBy', '==', user.uid))
        );
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setInvitations(loaded.reverse());
      } catch (err) {
        console.error('Error loading invitations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInvitations();
  }, [user]);

  const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    // Leaders can only invite scouts
    const typeToUse = profile?.role === 'admin' ? inviteType : 'scout';

    try {
      const code = generateCode();
      const createdAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

      await addDoc(collection(db, 'invitations'), {
        email,
        code,
        role: typeToUse,
        status: 'pending',
        createdBy: user.uid,
        createdByName: profile?.name,
        createdAt,
        expiresAt
      });

      setSuccess(`✓ Invitation sent to ${email}! Share the code: ${code}`);
      setEmail('');

      // Reload invitations
      const snap = await getDocs(
        query(collection(db, 'invitations'), where('createdBy', '==', user.uid))
      );
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInvitations(loaded.reverse());
    } catch (err) {
      setError('Failed to send invitation: ' + err.message);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Header */}
      <section className="hero-page section" style={{ minHeight: '30vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>📧 Send Invitations</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {profile?.role === 'admin'
                ? 'Invite leaders to manage your troop'
                : 'Invite scouts to join your troop'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section section--dark">
        <div className="container" style={{ maxWidth: '600px' }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: 32, marginBottom: 40 }}
          >
            <h2 style={{ marginBottom: 24 }}>New Invitation</h2>

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
                  marginBottom: 16,
                  fontSize: '0.9rem'
                }}
              >
                ✕ {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: 12,
                  background: 'rgba(82, 183, 136, 0.1)',
                  border: '1px solid rgba(82, 183, 136, 0.3)',
                  borderRadius: 8,
                  color: '#52b788',
                  marginBottom: 16,
                  fontSize: '0.9rem'
                }}
              >
                ✓ {success}
              </motion.div>
            )}

            <form onSubmit={handleSendInvitation} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="person@example.com"
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

              {profile?.role === 'admin' && (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Invite as
                  </label>
                  <select
                    value={inviteType}
                    onChange={(e) => setInviteType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      borderRadius: 8,
                      color: 'var(--text-primary)',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="leader">Leader</option>
                    <option value="scout">Scout</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, var(--bg-secondary), var(--accent))',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <Mail size={18} />
                Send Invitation
              </button>
            </form>
          </motion.div>

          {/* Sent Invitations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ marginBottom: 24 }}>Sent Invitations ({invitations.length})</h2>

            {isLoading ? (
              <p>Loading invitations...</p>
            ) : invitations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No invitations sent yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {invitations.map(inv => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ padding: 16 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {inv.email}
                        </p>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {inv.role === 'leader' ? '👔 Leader' : '🧭 Scout'} • {inv.status}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(inv.createdAt).toLocaleDateString()} at {new Date(inv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(inv.code)}
                        style={{
                          padding: '6px 12px',
                          background: copiedId === inv.code ? 'rgba(82, 183, 136, 0.2)' : 'rgba(100, 150, 200, 0.2)',
                          color: copiedId === inv.code ? '#52b788' : '#6496c8',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {copiedId === inv.code ? (
                          <>
                            <Check size={14} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> {inv.code}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
