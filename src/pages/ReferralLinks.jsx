import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Mail, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createInvitation, revokeInvitation } from '../utils/invitations';

export default function ReferralLinks() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [copiedId, setCopiedId] = useState(null);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [generatingFor, setGeneratingFor] = useState(null);
  const baseUrl = window.location.origin;

  // Check authorization
  useEffect(() => {
    if (loading) return;
    if (!user || !['leader', 'admin'].includes(profile?.role)) {
      navigate('/member-login');
    }
  }, [user, profile, loading, navigate]);

  // Generate a new invitation code
  const handleGenerateCode = async (role) => {
    setGeneratingFor(role);
    try {
      const code = await createInvitation(role, 30, user?.uid);
      const url = `${baseUrl}/register?code=${code}`;
      setGeneratedCodes([
        ...generatedCodes,
        {
          code,
          role,
          url,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (error) {
      alert('Error generating invitation code: ' + error.message);
    } finally {
      setGeneratingFor(null);
    }
  };

  // Revoke an invitation code
  const handleRevokeCode = async (code) => {
    if (!window.confirm('Are you sure you want to revoke this invitation code?')) {
      return;
    }
    try {
      await revokeInvitation(code);
      setGeneratedCodes(generatedCodes.filter(c => c.code !== code));
    } catch (error) {
      alert('Error revoking code: ' + error.message);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendViaEmail = (role, code, url) => {
    const subject = encodeURIComponent(`Join Troop 242 as a ${role}`);
    const body = encodeURIComponent(
      `Hello!\n\nYou've been invited to join Troop 242 as a ${role}.\n\nInvitation Code: ${code}\n\nRegistration Link:\n${url}\n\nThis invitation expires in 30 days.\n\nSimply click the link above to get started!\n\nWelcome to the troop!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
            <h1 style={{ marginBottom: 16 }}>🔗 Share Referral Links</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Create secure, expiring invitation codes for leaders and scouts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section section--dark">
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Generate New Codes Section */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ marginBottom: 16 }}>Generate Invitation Codes</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => handleGenerateCode('leader')}
                disabled={generatingFor === 'leader'}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#6496c8',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: generatingFor === 'leader' ? 'wait' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  opacity: generatingFor === 'leader' ? 0.7 : 1
                }}
              >
                <Plus size={18} /> {generatingFor === 'leader' ? 'Generating...' : 'New Leader Code'}
              </button>
              <button
                onClick={() => handleGenerateCode('scout')}
                disabled={generatingFor === 'scout'}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#52b788',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: generatingFor === 'scout' ? 'wait' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  opacity: generatingFor === 'scout' ? 0.7 : 1
                }}
              >
                <Plus size={18} /> {generatingFor === 'scout' ? 'Generating...' : 'New Scout Code'}
              </button>
            </div>
          </div>

          {/* Generated Codes List */}
          {generatedCodes.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ marginBottom: 16 }}>Your Invitation Links</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {generatedCodes.map((link) => {
                  const colors = link.role === 'leader'
                    ? { color: '#6496c8', bgColor: 'rgba(100, 150, 200, 0.1)', borderColor: 'rgba(100, 150, 200, 0.3)' }
                    : { color: '#52b788', bgColor: 'rgba(82, 183, 136, 0.1)', borderColor: 'rgba(82, 183, 136, 0.3)' };

                  return (
                    <motion.div
                      key={link.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card"
                      style={{
                        padding: 24,
                        border: `2px solid ${colors.borderColor}`,
                        background: colors.bgColor
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                        <div>
                          <h3 style={{ marginBottom: 4, color: colors.color }}>
                            {link.role === 'leader' ? '👔' : '🧭'} {link.role.toUpperCase()} Invitation
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                            Expires: {link.expiresAt.toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRevokeCode(link.code)}
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <Trash2 size={14} /> Revoke
                        </button>
                      </div>

                      {/* URL Display */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Registration Link
                        </label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            type="text"
                            readOnly
                            value={link.url}
                            style={{
                              flex: 1,
                              padding: '12px 16px',
                              background: 'var(--input-bg)',
                              border: '1px solid var(--input-border)',
                              borderRadius: 8,
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem',
                              fontFamily: 'monospace'
                            }}
                          />
                          <button
                            onClick={() => copyToClipboard(link.url, `url-${link.code}`)}
                            style={{
                              padding: '12px 16px',
                              background: copiedId === `url-${link.code}` ? colors.color : colors.borderColor,
                              color: copiedId === `url-${link.code}` ? 'white' : colors.color,
                              border: 'none',
                              borderRadius: 8,
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {copiedId === `url-${link.code}` ? <Check size={16} /> : <Copy size={16} />}
                            {copiedId === `url-${link.code}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* Code Display */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Code (if sharing manually)
                        </label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            type="text"
                            readOnly
                            value={link.code}
                            style={{
                              flex: 1,
                              padding: '12px 16px',
                              background: 'var(--input-bg)',
                              border: '1px solid var(--input-border)',
                              borderRadius: 8,
                              color: 'var(--text-primary)',
                              fontSize: '1.1rem',
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              letterSpacing: '2px'
                            }}
                          />
                          <button
                            onClick={() => copyToClipboard(link.code, `code-${link.code}`)}
                            style={{
                              padding: '12px 16px',
                              background: copiedId === `code-${link.code}` ? colors.color : colors.borderColor,
                              color: copiedId === `code-${link.code}` ? 'white' : colors.color,
                              border: 'none',
                              borderRadius: 8,
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {copiedId === `code-${link.code}` ? <Check size={16} /> : <Copy size={16} />}
                            {copiedId === `code-${link.code}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => sendViaEmail(link.role, link.code, link.url)}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            background: colors.borderColor,
                            color: colors.color,
                            border: `1px solid ${colors.color}`,
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            transition: 'all 0.2s'
                          }}
                        >
                          <Mail size={16} /> Send via Email
                        </button>
                        <button
                          onClick={() => {
                            const message = `Join Troop 242 as a ${link.role}!\n\n${link.url}`;
                            if (navigator.share) {
                              navigator.share({
                                title: `${link.role.toUpperCase()} Invitation`,
                                text: message
                              });
                            } else {
                              copyToClipboard(message, `share-${link.code}`);
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            background: colors.borderColor,
                            color: colors.color,
                            border: `1px solid ${colors.color}`,
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            transition: 'all 0.2s'
                          }}
                        >
                          <Share2 size={16} /> Share
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {generatedCodes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: 40,
                textAlign: 'center',
                background: 'rgba(139, 92, 246, 0.05)',
                borderRadius: 12,
                border: '2px dashed rgba(139, 92, 246, 0.2)',
                marginBottom: 40
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                Click "New Leader Code" or "New Scout Code" above to generate your first invitation link
              </p>
            </motion.div>
          )}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: 20,
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 8,
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              lineHeight: '1.6'
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: 'var(--text-primary)' }}>💡 How to Use</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Generate a new code for each person you want to invite</li>
              <li>Each code expires after 30 days for security</li>
              <li>Copy the link or code and share it via email, text, or messenger</li>
              <li>The person clicks the link and creates their account</li>
              <li>Revoke codes anytime if you change your mind</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
}
