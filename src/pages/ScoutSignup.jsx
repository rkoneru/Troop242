
import { CheckCircle, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const ACTIVITIES = [
  {
    id: 1,
    name: 'Camping Trip',
    description: 'Weekend camping adventure in the mountains',
    date: '2026-04-15',
    location: 'Blue Ridge Mountains',
    maxSpots: 20,
    spotsLeft: 5,
    icon: '⛺'
  },
  {
    id: 2,
    name: 'Car Wash',
    description: 'Troop fundraiser - help wash cars',
    date: '2026-03-22',
    location: 'Sanford Community Center',
    maxSpots: 15,
    spotsLeft: 8,
    icon: '🚗'
  },
  {
    id: 3,
    name: 'Shop & Sell',
    description: 'Sell firewood to raise funds for troop',
    date: '2026-03-29',
    location: 'Various Locations',
    maxSpots: 25,
    spotsLeft: 12,
    icon: '🪵'
  },
  {
    id: 4,
    name: 'Community Service',
    description: 'Help clean up local parks and trails',
    date: '2026-04-05',
    location: 'Seminole State Park',
    maxSpots: 30,
    spotsLeft: 18,
    icon: '🌳'
  },
  {
    id: 5,
    name: 'Hiking Expedition',
    description: 'Day hike with skills training',
    date: '2026-03-30',
    location: 'Ocala National Forest',
    maxSpots: 20,
    spotsLeft: 10,
    icon: '🥾'
  },
  {
    id: 6,
    name: 'Skill Workshop',
    description: 'Learn knot tying and survival skills',
    date: '2026-04-10',
    location: 'Troop Meeting Place',
    maxSpots: 25,
    spotsLeft: 15,
    icon: '🎓'
  }
];

export default function ScoutSignup() {
  const [signedUp, setSignedUp] = useState([]);

  const handleSignup = (activityId) => {
    if (!signedUp.includes(activityId)) {
      setSignedUp([...signedUp, activityId]);
    }
  };

  const handleCancel = (activityId) => {
    setSignedUp(signedUp.filter(id => id !== activityId));
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
      <section className="hero-page section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>🎯 Scout Activities & Events</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Sign up for upcoming troop activities and events
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section section--dark">
        <div className="container">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 48
            }}
          >
            <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12, border: '1px solid var(--accent-border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎯</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Events Available</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{ACTIVITIES.length}</p>
            </div>
            <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12, border: '1px solid var(--accent-border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>✓</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Events Signed Up</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{signedUp.length}</p>
            </div>
            <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12, border: '1px solid var(--accent-border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Upcoming Events</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{ACTIVITIES.filter(a => !signedUp.includes(a.id)).length}</p>
            </div>
          </motion.div>

          {/* Activities Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24
            }}
          >
            {ACTIVITIES.map((activity) => {
              const isSignedUp = signedUp.includes(activity.id);
              return (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="glass-card"
                  style={{
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    border: isSignedUp ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {isSignedUp && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'var(--accent-dim)',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <CheckCircle size={14} /> Signed Up
                    </div>
                  )}

                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{activity.icon}</div>

                  <h3 style={{ marginBottom: 8, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{activity.name}</h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16, flex: 1 }}>
                    {activity.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Calendar size={16} style={{ color: 'var(--accent)' }} />
                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <MapPin size={16} style={{ color: 'var(--accent)' }} />
                      {activity.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Users size={16} style={{ color: 'var(--accent)' }} />
                      {activity.spotsLeft} of {activity.maxSpots} spots available
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--accent-dim)',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 16,
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--accent)'
                  }}>
                    {activity.spotsLeft > 5 ? '✓ Spots Available' : '⚠ Limited Spots'}
                  </div>

                  {isSignedUp ? (
                    <button
                      onClick={() => handleCancel(activity.id)}
                      style={{
                        padding: '10px 20px',
                        background: 'var(--accent-dim)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-border)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--accent-border)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'var(--accent-dim)';
                      }}
                    >
                      Cancel Signup
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSignup(activity.id)}
                      disabled={activity.spotsLeft === 0}
                      style={{
                        padding: '10px 20px',
                        background: activity.spotsLeft > 0 ? 'linear-gradient(135deg, var(--bg-secondary), var(--accent))' : 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 8,
                        cursor: activity.spotsLeft > 0 ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        width: '100%',
                        opacity: activity.spotsLeft > 0 ? 1 : 0.5
                      }}
                      onMouseEnter={(e) => {
                        if (activity.spotsLeft > 0) {
                          e.target.style.boxShadow = '0 6px 24px var(--accent-dim)';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {activity.spotsLeft > 0 ? 'Sign Up' : 'Full'}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
