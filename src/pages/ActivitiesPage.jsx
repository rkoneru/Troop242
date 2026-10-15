import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MapPin, Calendar, Clock } from 'lucide-react';
import { collection, getDocs, query, orderBy, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

// Hoist static Framer Motion animation variants to module scope to avoid re-allocations on every render frame
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // State
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize date boundary and filter/sort operations for activities and events
  // to avoid re-allocating arrays and re-parsing date objects on every component re-render.
  const { activities, events, mySignupCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeActivities = allItems.filter(i => i.type === 'activity' && new Date(i.date) >= today);
    const activeEvents = allItems.filter(i => i.type === 'event' && new Date(i.date) >= today);

    const signupCount = activeActivities.filter(a => a.signedUp?.some(s => s.uid === user?.uid)).length;

    return {
      activities: activeActivities,
      events: activeEvents,
      mySignupCount: signupCount
    };
  }, [allItems, user?.uid]);

  // Memoize user signup checker helper
  const isSignedUp = useCallback((item) => {
    return Boolean(item.signedUp?.some(s => s.uid === user?.uid));
  }, [user?.uid]);

  // Memoize activity capacity checker helper
  const isFull = useCallback((activity) => {
    return activity.type === 'activity' && (activity.signedUp?.length || 0) >= activity.spots;
  }, []);

  // Memoize my signed up activities list sorted chronologically
  const mySignedUpActivities = useMemo(() => {
    return activities
      .filter(a => isSignedUp(a))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activities, isSignedUp]);

  // Memoize available activities list sorted chronologically
  const availableActivities = useMemo(() => {
    return activities
      .filter(a => !isSignedUp(a))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activities, isSignedUp]);

  // Load all activities and events from Firestore
  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;
    const loadItems = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'activities'), orderBy('date', 'asc')));
        if (isMounted) {
          setAllItems(snap.docs.map(d => ({ id: d.id, ...d.data(), signedUp: d.data().signedUp || [] })));
          setError(null);
        }
      } catch (err) {
        console.error('Error loading activities:', err);
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadItems();
    return () => { isMounted = false; };
  }, [user]);

  // Toggle RSVP for an event
  const toggleRsvp = useCallback(async (eventId) => {
    if (!user) return;
    const displayName = profile?.name || user.displayName || user.email;
    const event = allItems.find(i => i.id === eventId);
    const existing = event?.signedUp?.find(s => s.uid === user.uid);

    try {
      if (existing) {
        await updateDoc(doc(db, 'activities', eventId), {
          signedUp: arrayRemove(existing)
        });
        setAllItems(prev => prev.map(item =>
          item.id === eventId
            ? { ...item, signedUp: item.signedUp.filter(s => s.uid !== user.uid) }
            : item
        ));
      } else {
        const rsvpEntry = { uid: user.uid, name: displayName, at: new Date().toISOString() };
        await updateDoc(doc(db, 'activities', eventId), {
          signedUp: arrayUnion(rsvpEntry)
        });
        setAllItems(prev => prev.map(item =>
          item.id === eventId
            ? { ...item, signedUp: [...item.signedUp, rsvpEntry] }
            : item
        ));
      }
    } catch (err) {
      console.error('RSVP error:', err);
    }
  }, [user, profile, allItems]);

  // Sign up for an activity
  const handleSignup = useCallback(async (activityId) => {
    if (!user) return;
    const displayName = profile?.name || user.displayName || user.email;

    try {
      const entry = { uid: user.uid, name: displayName, at: new Date().toISOString() };
      await updateDoc(doc(db, 'activities', activityId), {
        signedUp: arrayUnion(entry)
      });
      // Optimistic update
      setAllItems(prev => prev.map(item =>
        item.id === activityId
          ? { ...item, signedUp: [...item.signedUp, entry] }
          : item
      ));
    } catch (err) {
      console.error('Signup error:', err);
    }
  }, [user, profile]);

  const backRoute = profile?.role === 'leader' ? '/leader-dashboard' : '/scout-dashboard';

  if (!user) return null;

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 40, color: '#ff6464', textAlign: 'center' }}>
        <p>Error loading activities. Please try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: `1px solid var(--divider)`, padding: '16px 24px', marginBottom: 32 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.button
            className="btn btn-outline"
            onClick={() => navigate(backRoute)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ArrowLeft size={18} /> Back
          </motion.button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Troop Activities</h1>
          <div style={{ width: 120 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <h2 className="text-xl font-bold mb-5">Troop Activities</h2>

        {/* MY SIGNUPS TABLE */}
        {mySignupCount > 0 && (
          <div style={{ marginTop: 64, marginBottom: 64 }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: 700 }}>📋 My Signups</h2>
            <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600 }}>Activity</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600 }}>Location</th>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600 }}>Spots</th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mySignedUpActivities.map((activity) => {
                    const full = isFull(activity);
                    return (
                      <tr key={activity.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '16px', color: '#fff', fontWeight: 500 }}>{activity.title}</td>
                        <td style={{ padding: '16px', color: '#9ca3af', fontSize: '0.9rem' }}>
                          {new Date(activity.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px', color: '#9ca3af', fontSize: '0.9rem' }}>{activity.location || '—'}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: full ? '#ff6464' : 'var(--text-muted)', marginBottom: 6 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Users size={13} /> {activity.signedUp?.length ?? 0}/{activity.spots} spots
                              </span>
                              <span>{full ? 'Full' : `${activity.spots - (activity.signedUp?.length ?? 0)} remaining`}</span>
                            </div>
                            <div style={{ background: 'var(--divider)', borderRadius: 99, height: 6 }}>
                              <div style={{
                                width: `${Math.min(((activity.signedUp?.length ?? 0) / activity.spots) * 100, 100)}%`,
                                background: full ? '#ff6464' : 'var(--accent)',
                                height: '100%',
                                borderRadius: 99,
                                transition: 'width 0.4s ease',
                              }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{ background: 'rgba(82, 183, 136, 0.2)', color: '#52b788', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
                            ✓ Signed Up
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EVENTS SECTION */}
        {events.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: 700 }}>📅 Troop Events</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {events.map((evt) => {
                const isRsvped = isSignedUp(evt);
                return (
                  <div key={evt.id} style={{ background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)', padding: 24 }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{evt.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, fontSize: '0.9rem', color: '#9ca3af' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={14} />
                        {new Date(evt.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {evt.time && <><Clock size={14} style={{ marginLeft: 6 }} /> {evt.time}</>}
                      </span>
                      {evt.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={14} /> {evt.location}
                        </span>
                      )}
                    </div>
                    {evt.description && (
                      <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: 16, lineHeight: 1.5 }}>
                        {evt.description}
                      </p>
                    )}
                    <button
                      type="button"
                      aria-label={isRsvped ? `Mark uninterested in ${evt.title}` : `Mark interested in ${evt.title}`}
                      onClick={() => toggleRsvp(evt.id)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: isRsvped ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: isRsvped ? '#60a5fa' : '#fff',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {isRsvped ? '★ Interested' : '☆ RSVP / Interested'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AVAILABLE ACTIVITIES GRID */}
        {activities.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: 700 }}>🔓 Available Activities</h2>
            <motion.div
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20,
                padding: '0 20px'
              }}
            >
              {availableActivities.map((activity) => {
                const full = isFull(activity);

                return (
                  <motion.div
                    key={activity.id}
                    variants={ITEM_VARIANTS}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{activity.title}</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, fontSize: '0.9rem', color: '#9ca3af' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={14} />
                        {new Date(activity.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {activity.time && <><Clock size={14} style={{ marginLeft: 6 }} /> {activity.time}</>}
                      </span>
                      {activity.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={14} /> {activity.location}
                        </span>
                      )}
                    </div>

                    {activity.description && (
                      <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: 16, lineHeight: 1.5 }}>
                        {activity.description}
                      </p>
                    )}

                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: full ? '#ff6464' : '#9ca3af', marginBottom: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Users size={13} /> {activity.signedUp?.length || 0}/{activity.spots} spots
                        </span>
                        <span>{full ? 'Full' : `${activity.spots - (activity.signedUp?.length || 0)} remaining`}</span>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: 99, height: 6 }}>
                        <div style={{
                          width: `${Math.min(((activity.signedUp?.length || 0) / activity.spots) * 100, 100)}%`,
                          background: full ? '#ff6464' : 'var(--accent)',
                          height: '100%',
                          borderRadius: 99,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      {!full ? (
                        <motion.button
                          onClick={() => handleSignup(activity.id)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(0, 214, 143, 0.2)',
                            border: '1px solid rgba(0, 214, 143, 0.3)',
                            color: '#00d68f',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                          whileHover={{ background: 'rgba(0, 214, 143, 0.3)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Sign Up
                        </motion.button>
                      ) : (
                        <div style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 100, 100, 0.1)',
                          border: '1px solid rgba(255, 100, 100, 0.3)',
                          borderRadius: 8,
                          color: '#ff6464',
                          fontWeight: 600,
                          textAlign: 'center'
                        }}>
                          Activity Full
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {!loading && activities.length === 0 && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <p>No activities or events yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
