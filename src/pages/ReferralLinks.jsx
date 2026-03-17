import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ReferralLinks() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [copiedId, setCopiedId] = useState(null);

  // Check authorization
  useEffect(() => {
    if (loading) return;
    if (!user || !['leader', 'admin'].includes(profile?.role)) {
      navigate('/member-login');
    }
  }, [user, profile, loading, navigate]);

  // Generate fixed codes for leader and scout
  const leaderCode = 'LEADER01';
  const scoutCode = 'SCOUT01';
  const baseUrl = window.location.origin;

  const links = [
    {
      id: 'leader',
      title: '👔 Leader Registration',
      description: 'Share this link to invite leaders to manage the troop',
      code: leaderCode,
      url: `${baseUrl}/register?code=${leaderCode}`,
      color: '#6496c8',
      bgColor: 'rgba(100, 150, 200, 0.1)',
      borderColor: 'rgba(100, 150, 200, 0.3)'
    },
    {
      id: 'scout',
      title: '🧭 Scout Registration',
      description: 'Share this link to invite scouts to join the troop',
      code: scoutCode,
      url: `${baseUrl}/register?code=${scoutCode}`,
      color: '#52b788',
      bgColor: 'rgba(82, 183, 136, 0.1)',
      borderColor: 'rgba(82, 183, 136, 0.3)'
    }
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendViaEmail = (type, url) => {
    const subject = encodeURIComponent(`Join Troop 242 as a ${type}`);
    const body = encodeURIComponent(
      `Hello!\n\nYou've been invited to join Troop 242 as a ${type}.\n\nRegistration Link:\n${url}\n\nSimply click the link above to get started!\n\nWelcome to the troop!`
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
              Easy registration links for leaders and scouts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section section--dark">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {links.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card"
                style={{
                  padding: 32,
                  border: `2px solid ${link.borderColor}`,
                  background: link.bgColor
                }}
              >
                <h2 style={{ marginBottom: 8, color: link.color }}>{link.title}</h2>
                <p style={{ marginBottom: 24, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {link.description}
                </p>

                {/* URL Display */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Registration URL
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
                      onClick={() => copyToClipboard(link.url, `url-${link.id}`)}
                      style={{
                        padding: '12px 16px',
                        background: copiedId === `url-${link.id}` ? link.color : link.borderColor,
                        color: copiedId === `url-${link.id}` ? 'white' : link.color,
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copiedId === `url-${link.id}` ? <Check size={16} /> : <Copy size={16} />}
                      {copiedId === `url-${link.id}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Code Display */}
                <div style={{ marginBottom: 20 }}>
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
                      onClick={() => copyToClipboard(link.code, `code-${link.id}`)}
                      style={{
                        padding: '12px 16px',
                        background: copiedId === `code-${link.id}` ? link.color : link.borderColor,
                        color: copiedId === `code-${link.id}` ? 'white' : link.color,
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copiedId === `code-${link.id}` ? <Check size={16} /> : <Copy size={16} />}
                      {copiedId === `code-${link.id}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => sendViaEmail(link.title.split(' ')[1], link.url)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: link.borderColor,
                      color: link.color,
                      border: `1px solid ${link.color}`,
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
                    onMouseEnter={(e) => {
                      e.target.style.background = link.color;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = link.borderColor;
                      e.target.style.color = link.color;
                    }}
                  >
                    <Mail size={16} /> Send via Email
                  </button>
                  <button
                    onClick={() => {
                      const message = `Join Troop 242 as a ${link.title.split(' ')[1]}!\n\n${link.url}`;
                      if (navigator.share) {
                        navigator.share({
                          title: link.title,
                          text: message
                        });
                      } else {
                        copyToClipboard(message, `share-${link.id}`);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: link.borderColor,
                      color: link.color,
                      border: `1px solid ${link.color}`,
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
                    onMouseEnter={(e) => {
                      e.target.style.background = link.color;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = link.borderColor;
                      e.target.style.color = link.color;
                    }}
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: 40,
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
              <li>Copy the registration URL and send it to interested leaders or scouts</li>
              <li>They click the link and will be taken directly to the registration form</li>
              <li>No email invitation needed — it all happens via the link!</li>
              <li>You can also manually share the invitation code if preferred</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
}
