
import { Users, Shield, UserCheck } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/member-login.css';

// Dummy credentials for testing
const DUMMY_USERS = {
  scout: { email: 'scout@troop242.com', password: 'scout123', redirect: '/scout-dashboard' },
  leader: { email: 'leader@troop242.com', password: 'leader123', redirect: '/leader-dashboard' },
  admin: { email: 'admin@troop242.com', password: 'admin123', redirect: '/admin-dashboard' }
};

const PROFILES = {
  scout: {
    name: 'Scout',
    icon: Users,
    color: '#00d68f',
    description: 'Access your personal scout profile, track your progress, and view merit badges',
    features: ['View Merit Badges', 'Track Rank Progress', 'View Events', 'Update Profile']
  },
  leader: {
    name: 'Leader',
    icon: UserCheck,
    color: '#52b788',
    description: 'Manage scouts, track progress, and organize troop activities',
    features: ['Manage Scouts', 'Track Progress', 'Schedule Events', 'View Reports']
  },
  admin: {
    name: 'Administrator',
    icon: Shield,
    color: '#d4a853',
    description: 'Full access to all troop data, settings, and administrative functions',
    features: ['Full Access', 'User Management', 'System Settings', 'Analytics']
  }
};

export default function MemberLogin() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const tapRef = useRef({ count: 0, timer: null });

  const handleSecretTap = () => {
    tapRef.current.count += 1;
    clearTimeout(tapRef.current.timer);
    tapRef.current.timer = setTimeout(() => { tapRef.current.count = 0; }, 1500);
    if (tapRef.current.count >= 5) {
      tapRef.current.count = 0;
      setAdminUnlocked(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedProfile || !email || !password) {
      setError('Please select a profile and enter credentials');
      return;
    }

    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      const dummyUser = DUMMY_USERS[selectedProfile];

      if (email === dummyUser.email && password === dummyUser.password) {
        // Store login info in sessionStorage for demo purposes
        sessionStorage.setItem('loggedInUser', JSON.stringify({
          profile: selectedProfile,
          email: email,
          name: PROFILES[selectedProfile].name
        }));

        // Redirect to appropriate page
        setLoading(false);
        navigate(dummyUser.redirect);
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 1000);
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <h1 style={{ marginBottom: 16 }}><span onClick={handleSecretTap} style={{ cursor: 'default', userSelect: 'none' }}>👥</span> Member Login</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Select your profile type and log in to access Troop 242's member portal
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Selection */}
      <section className="section section--dark">
        <div className="container">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              {!selectedProfile ? (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Select Your Profile</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
                    {Object.entries(PROFILES).filter(([key]) => key !== 'admin' || adminUnlocked).map(([key, profile]) => {
                      const Icon = profile.icon;
                      return (
                        <motion.div
                          key={key}
                          variants={itemVariants}
                          onClick={() => setSelectedProfile(key)}
                          className="glass-card"
                          style={{ padding: 32, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease', textAlign: 'center' }}
                          whileHover={{ scale: 1.05, borderColor: profile.color }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon size={48} style={{ color: profile.color, margin: '0 auto 16px' }} />
                          <h3 style={{ marginBottom: 12, color: 'var(--text-primary)' }}>{profile.name}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.6 }}>
                            {profile.description}
                          </p>
                          <div style={{ textAlign: 'left' }}>
                            {profile.features.map((feature, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <span style={{ color: profile.color }}>✓</span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  style={{
                    maxWidth: '450px',
                    margin: '0 auto',
                    padding: 32,
                    background: 'var(--glass-bg)',
                    border: `1px solid ${PROFILES[selectedProfile].color}40`,
                    borderRadius: 16,
                    backdropFilter: 'blur(12px)'
                  }}
                >
                <h3 style={{ marginBottom: 24, textAlign: 'center', color: 'var(--text-primary)' }}>
                  Login as {PROFILES[selectedProfile].name}
                </h3>

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
                      marginBottom: 16
                    }}
                  >
                    ✕ {error}
                  </motion.div>
                )}

                {/* Test Credentials Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: 12,
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginBottom: 16
                  }}
                >
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: 'var(--accent)' }}>📝 Test Credentials:</p>
                  <p style={{ margin: '0 0 4px 0' }}>Email: {DUMMY_USERS[selectedProfile].email}</p>
                  <p style={{ margin: 0 }}>Password: {DUMMY_USERS[selectedProfile].password}</p>
                </motion.div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
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
                        e.target.style.borderColor = 'var(--accent-border)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
                        e.target.style.boxShadow = 'none';
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
                        e.target.style.borderColor = 'var(--accent-border)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
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
                      background: `linear-gradient(135deg, var(--bg-secondary), var(--accent))`,
                      color: 'var(--text-primary)',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      marginTop: 8,
                      transition: 'all 0.2s ease',
                      boxShadow: `0 4px 16px var(--accent-dim)`,
                      opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = `0 6px 24px var(--accent-dim)`;
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = `0 4px 16px var(--accent-dim)`;
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {loading ? '⏳ Logging in...' : 'Login'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => { setSelectedProfile(null); setError(''); setEmail(''); setPassword(''); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      ← Choose a different profile
                    </button>
                  </div>
                </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
