
import { Users, Shield, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/member-login.css';

// Dummy credentials for testing
const DUMMY_USERS = {
  scout: { email: 'scout@troop242.com', password: 'scout123', redirect: '/scout-signup' },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Header */}
      <section className="section section--hero section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>👥 Member Login</h1>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
              Select your profile type and log in to access Troop 242's member portal
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Selection */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Select Your Profile</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
              {Object.entries(PROFILES).map(([key, profile]) => {
                const Icon = profile.icon;
                return (
                  <motion.div
                    key={key}
                    variants={itemVariants}
                    onClick={() => setSelectedProfile(key)}
                    className="glass-card"
                    style={{
                      padding: 32,
                      cursor: 'pointer',
                      border: selectedProfile === key ? `2px solid ${profile.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={48} style={{ color: profile.color, marginBottom: 16, margin: '0 auto 16px' }} />
                    <h3 style={{ marginBottom: 12, color: '#fff' }}>{profile.name}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.6 }}>
                      {profile.description}
                    </p>

                    <div style={{ textAlign: 'left', marginBottom: 16 }}>
                      {profile.features.map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.85rem', color: '#d1d5db' }}>
                          <span style={{ color: profile.color }}>✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {selectedProfile === key && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          backgroundColor: `${profile.color}20`,
                          borderRadius: '8px',
                          color: profile.color,
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        Selected
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Login Form */}
            {selectedProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  maxWidth: '450px',
                  margin: '0 auto',
                  padding: 32,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  backdropFilter: 'blur(12px)'
                }}
              >
                <h3 style={{ marginBottom: 24, textAlign: 'center', color: '#fff' }}>
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
                    background: 'rgba(0, 214, 143, 0.1)',
                    border: '1px solid rgba(0, 214, 143, 0.2)',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginBottom: 16
                  }}
                >
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#00d68f' }}>📝 Test Credentials:</p>
                  <p style={{ margin: '0 0 4px 0' }}>Email: {DUMMY_USERS[selectedProfile].email}</p>
                  <p style={{ margin: 0 }}>Password: {DUMMY_USERS[selectedProfile].password}</p>
                </motion.div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: '#9ca3af' }}>
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
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 214, 143, 0.3)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 214, 143, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: '#9ca3af' }}>
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
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 214, 143, 0.3)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 214, 143, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      background: `linear-gradient(135deg, #2d6a4f, ${PROFILES[selectedProfile].color})`,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      marginTop: 8,
                      transition: 'all 0.2s ease',
                      boxShadow: `0 4px 16px rgba(0, 214, 143, 0.2)`,
                      opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = `0 6px 24px rgba(0, 214, 143, 0.3)`;
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.boxShadow = `0 4px 16px rgba(0, 214, 143, 0.2)`;
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {loading ? '⏳ Logging in...' : 'Login'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: '#9ca3af' }}>
                    <p>Don't have an account? <span style={{ color: '#00d68f', cursor: 'pointer' }}>Contact your troop leader</span></p>
                  </div>
                </form>
              </motion.div>
            )}
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
              <div style={{ padding: 24, background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h4 style={{ color: '#00d68f', marginBottom: 12 }}>🔒 Security</h4>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  All accounts are secured with encryption and require two-factor authentication for sensitive operations.
                </p>
              </div>

              <div style={{ padding: 24, background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h4 style={{ color: '#52b788', marginBottom: 12 }}>📱 Mobile Friendly</h4>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Access your account from any device. The member portal is fully responsive and works on all screens.
                </p>
              </div>

              <div style={{ padding: 24, background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h4 style={{ color: '#d4a853', marginBottom: 12 }}>💬 Support</h4>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6 }}>
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
