
import { CheckCircle, MapPin, Calendar, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function ScoutSignup() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load activities from Firestore on mount
  useEffect(() => {
    if (loading) return;

    const loadActivities = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'activities'), orderBy('date', 'asc'))
        );
        const loaded = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          signedUp: d.data().signedUp || []
        }));
        setActivities(loaded);
      } catch (err) {
        console.error('Error loading activities:', err);
        setError('Failed to load activities');
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [loading]);

  const isSignedUp = (activityId) => {
    return activities
      .find(a => a.id === activityId)
      ?.signedUp?.some(s => s.uid === user?.uid) || false;
  };

  const handleSignup = async (activityId) => {
    if (!user || !profile) {
      navigate('/member-login');
      return;
    }

    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity || isSignedUp(activityId)) return;

      await updateDoc(doc(db, 'activities', activityId), {
        signedUp: arrayUnion({
          uid: user.uid,
          name: profile.name,
          at: new Date().toISOString()
        })
      });

      // Refresh activities
      const snap = await getDocs(
        query(collection(db, 'activities'), orderBy('date', 'asc'))
      );
      const loaded = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        signedUp: d.data().signedUp || []
      }));
      setActivities(loaded);
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Failed to sign up for activity');
    }
  };

  const handleCancel = async (activityId) => {
    if (!user) return;

    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const signupToRemove = activity.signedUp.find(s => s.uid === user.uid);
      if (!signupToRemove) return;

      await updateDoc(doc(db, 'activities', activityId), {
        signedUp: arrayRemove(signupToRemove)
      });

      // Refresh activities
      const snap = await getDocs(
        query(collection(db, 'activities'), orderBy('date', 'asc'))
      );
      const loaded = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        signedUp: d.data().signedUp || []
      }));
      setActivities(loaded);
    } catch (err) {
      console.error('Error canceling signup:', err);
      setError('Failed to cancel signup');
    }
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

  if (isLoading) {
    return (
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading activities...</p>
        </div>
      </section>
    );
  }

  const userSignups = activities.filter(a => isSignedUp(a.id));

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
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: 16,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                color: '#ef4444',
                marginBottom: 24
              }}
            >
              ✕ {error}
            </motion.div>
          )}

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
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{activities.length}</p>
            </div>
            <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12, border: '1px solid var(--accent-border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>✓</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Events Signed Up</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{userSignups.length}</p>
            </div>
            <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12, border: '1px solid var(--accent-border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Upcoming Events</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{activities.filter(a => !isSignedUp(a.id)).length}</p>
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
            {activities.map((activity) => {
              const activitySignedUp = isSignedUp(activity.id);
              return (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="glass-card"
                  style={{
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    border: activitySignedUp ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {activitySignedUp && (
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
                      {activity.signedUp?.length || 0} scouts signed up
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
                    ✓ Accepting Signups
                  </div>

                  {activitySignedUp ? (
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
