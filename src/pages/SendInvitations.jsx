import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, Share2, ExternalLink } from 'lucide-react';
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
  const [generatedInvite, setGeneratedInvite] = useState(null);

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

  const generateCode = () => {
    const array = new Uint8Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGeneratedInvite(null);

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
      const registrationUrl = `${window.location.origin}/register?code=${code}`;

      await addDoc(collection(db, 'invitations'), {
        email,
        code,
        role: typeToUse,
        status: 'pending',
        createdBy: user.uid,
        createdByName: profile?.name,
        createdAt,
        expiresAt,
        registrationUrl
      });

      // Generate the invite for display
      setGeneratedInvite({
        email,
        code,
        role: typeToUse,
        registrationUrl
      });

      setEmail('');

      // Reload invitations
      const snap = await getDocs(
        query(collection(db, 'invitations'), where('createdBy', '==', user.uid))
      );
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInvitations(loaded.reverse());

      // Show success message
      setSuccess('✓ Invitation created! Copy the link below and send it to the recipient.');
    } catch (err) {
      setError('Failed to create invitation: ' + err.message);
    }
  };

  const copyToClipboard = (text, type = 'code') => {
    navigator.clipboard.writeText(text);
    setCopiedId(type);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendViaEmail = (inviteEmail, code) => {
    const registrationUrl = `${window.location.origin}/register?code=${code}`;
    const subject = encodeURIComponent('Join Troop 242!');
    const body = encodeURIComponent(
      `Hello!\n\nYou've been invited to join Troop 242.\n\nRegistration Link:\n${registrationUrl}\n\nInvitation Code: ${code}\n\nThe link will expire in 7 days.`
    );
    window.location.href = `mailto:${inviteEmail}?subject=${subject}&body=${body}`;
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

            {success && !generatedInvite && (
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

            {/* Generated Invite Display */}
            {generatedInvite && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: 20,
                  background: 'rgba(82, 183, 136, 0.1)',
                  border: '2px solid rgba(82, 183, 136, 0.3)',
                  borderRadius: 8,
                  marginBottom: 24
                }}
              >
                <p style={{ margin: '0 0 12px 0', fontWeight: 600, color: '#52b788', fontSize: '0.9rem' }}>
                  ✓ Invitation Created!
                </p>
                <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Send to: <strong style={{ fontFamily: 'monospace' }}>{generatedInvite.email}</strong>
                </p>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Registration Link:
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      readOnly
                      value={generatedInvite.registrationUrl}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 4,
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace'
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard(generatedInvite.registrationUrl, 'link')}
                      style={{
                        padding: '8px 12px',
                        background: copiedId === 'link' ? 'rgba(82, 183, 136, 0.2)' : 'rgba(100, 150, 200, 0.2)',
                        color: copiedId === 'link' ? '#52b788' : '#6496c8',
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
                      {copiedId === 'link' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === 'link' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Invitation Code:
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      readOnly
                      value={generatedInvite.code}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 4,
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        letterSpacing: '2px'
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard(generatedInvite.code, 'code')}
                      style={{
                        padding: '8px 12px',
                        background: copiedId === 'code' ? 'rgba(82, 183, 136, 0.2)' : 'rgba(100, 150, 200, 0.2)',
                        color: copiedId === 'code' ? '#52b788' : '#6496c8',
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
                      {copiedId === 'code' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === 'code' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => sendViaEmail(generatedInvite.email, generatedInvite.code)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: 'rgba(82, 183, 136, 0.2)',
                      color: '#52b788',
                      border: '1px solid rgba(82, 183, 136, 0.3)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <Mail size={14} /> Send via Email
                  </button>
                  <button
                    onClick={() => {
                      const message = `Hi ${generatedInvite.email}!\n\nYou're invited to join Troop 242!\n\nRegistration Link: ${generatedInvite.registrationUrl}\n\nInvitation Code: ${generatedInvite.code}`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'Join Troop 242',
                          text: message
                        });
                      } else {
                        copyToClipboard(message, 'message');
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: 'rgba(100, 150, 200, 0.2)',
                      color: '#6496c8',
                      border: '1px solid rgba(100, 150, 200, 0.3)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>

                <button
                  onClick={() => setGeneratedInvite(null)}
                  style={{
                    width: '100%',
                    marginTop: 12,
                    padding: '8px 16px',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--divider)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  Create Another Invitation
                </button>
              </motion.div>
            )}

            {!generatedInvite && (
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
                  Create Invitation
                </button>
              </form>
            )}
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
