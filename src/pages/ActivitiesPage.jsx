import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MapPin, Calendar, Heart } from 'lucide-react';
import { collection, getDocs, query, orderBy, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // State
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signupConfirmed, setSignupConfirmed] = useState({});

  // Derive activities and events from allItems
  const activities = allItems.filter(i => i.type === 'activity');
  const events = allItems.filter(i => i.type === 'event');

  // Calculate signup count for user
  const mySignupCount = activities.filter(a => a.signedUp?.some(s => s.uid === user?.uid)).length;

  // Load all activities and events from Firestore
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadItems = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'activities'), orderBy('date', 'asc')));
        setAllItems(snap.docs.map(d => ({ id: d.id, ...d.data(), signedUp: d.data().signedUp || [] })));
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [user]);

  // Toggle RSVP for an event
  const toggleRsvp = async (eventId) => {
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
    } catch (error) {
      console.error('RSVP error:', error);
    }
  };

  // Sign up for an activity
  const handleSignup = async (activityId) => {
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
      setSignupConfirmed(prev => ({ ...prev, [activityId]: true }));
      setTimeout(() => setSignupConfirmed(prev => ({ ...prev, [activityId]: false })), 2000);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const isSignedUp = (item) => item.signedUp?.some(s => s.uid === user?.uid) || false;

  const isFull = (activity) => activity.type === 'activity' && (activity.signedUp?.length || 0) >= activity.spots;

  const backRoute = user?.profile === 'leader' ? '/leader-dashboard' : '/scout-dashboard';

  if (!user) return null;

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

        {/* ── ACTIVITIES INLINE SECTION ── */}
        <div style={{ marginTop: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginLeft: 20, marginRight: 20 }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>🏕️ Upcoming Activities</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {mySignupCount} signed up
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="glass-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', margin: '0 20px' }}>
              No activities scheduled yet. Check back soon!
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
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
              {activities
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((activity) => {
                  const signedUp = isSignedUp(activity);
                  const full = isFull(activity);

                  return (
                    <motion.div
                      key={activity.id}
                      variants={itemVariants}
                      className="glass-card"
                      style={{
                        padding: 24,
                        border: signedUp
                          ? '1px solid var(--accent-border)'
                          : '1px solid var(--glass-border)',
                      }}
                    >
                      {/* Title + signed-up badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{activity.title}</h3>
                        {signedUp && (
                          <span style={{
                            padding: '3px 10px',
                            background: 'var(--accent-dim)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-border)',
                            borderRadius: 20,
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <CheckCircle size={12} />
                            Signed Up
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, color: 'var(--text-muted)', fontSize: '0.87rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={14} />
                          {new Date(activity.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          {activity.time && <><Clock size={14} style={{ marginLeft: 6 }} /> {activity.time}</>}
                        </span>
                        {activity.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={14} /> {activity.location}
                          </span>
                        )}
                      </div>

                      {activity.description && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16, lineHeight: 1.5 }}>
                          {activity.description}
                        </p>
                      )}

                      {/* Spots bar */}
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

                      {/* CTA */}
                      {!signedUp && !full && (
                        <motion.button
                          className="btn btn-primary"
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => handleSignup(activity.id)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Sign Up
                        </motion.button>
                      )}
                      {signedUp && (
                        <div style={{
                          padding: '10px 16px',
                          textAlign: 'center',
                          background: 'var(--accent-dim)',
                          border: '1px solid var(--accent-border)',
                          borderRadius: 10,
                          color: 'var(--accent)',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}>
                          You're signed up!
                        </div>
                      )}
                      {!signedUp && full && (
                        <div style={{
                          padding: '10px 16px',
                          textAlign: 'center',
                          background: 'rgba(255, 100, 100, 0.1)',
                          border: '1px solid rgba(255, 100, 100, 0.3)',
                          borderRadius: 10,
                          color: '#ff6464',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}>
                          Activity Full
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </motion.div>
          )}
        </div>

        {/* ACTIVITY & EVENT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.length === 0 && events.length === 0 ? (
            <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
              <p>No activities or events yet. {user?.profile === 'leader' ? 'Create one above!' : 'Check back soon!'}</p>
            </div>
          ) : (
            <>
              {/* Activities */}
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold mt-0 mb-3 text-[var(--text-main)]">
                    {activity.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-sm">
                    <Calendar size={16} /> {activity.date}
                  </div>

                  {activity.location && (
                    <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-sm">
                      <MapPin size={16} /> {activity.location}
                    </div>
                  )}

                  {activity.description && (
                    <p className="text-[var(--text-muted)] text-sm mb-3 mt-2">
                      {activity.description}
                    </p>
                  )}

                  <div
                    className={`flex items-center gap-2 px-3 py-3 bg-[var(--bg-primary)] rounded-lg mb-4 text-sm ${
                      isFull(activity) ? 'text-red-500' : 'text-[var(--accent)]'
                    }`}
                  >
                    <Users size={16} /> {activity.signedUp?.length || 0}/{activity.spots} Spots {isFull(activity) ? '(Full)' : 'Available'}
                  </div>

                  {/* Scout view: sign up button */}
                  {!isSignedUp(activity) && !isFull(activity) && (
                    <motion.button
                      className="btn btn-primary w-full"
                      onClick={() => handleSignup(activity.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.button>
                  )}
                  {isSignedUp(activity) && (
                    <div className="px-3 py-3 text-center bg-[var(--bg-primary)] rounded-lg text-[var(--accent)] font-semibold">
                      ✓ Signed Up!
                    </div>
                  )}
                  {isFull(activity) && !isSignedUp(activity) && (
                    <div className="px-3 py-3 text-center bg-[var(--bg-primary)] rounded-lg text-red-500 font-semibold">
                      Activity Full
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Events from Firestore */}
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold mt-0 mb-3 text-[var(--text-main)]">
                    {event.title}
                  </h3>

                  {event.createdBy && (
                    <p className="text-[var(--text-muted)] text-sm mb-2">
                      👤 By {event.createdBy}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-sm">
                    <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
                  </div>

                  {event.time && (
                    <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-sm">
                      🕐 {event.time}
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] text-sm">
                      <MapPin size={16} /> {event.location}
                    </div>
                  )}

                  {event.description && (
                    <p className="text-[var(--text-muted)] text-sm mb-3 mt-2">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 px-3 py-3 bg-[var(--bg-primary)] rounded-lg mb-4 text-sm text-[var(--accent)]">
                    <Users size={16} /> {event.signedUp?.length || 0} scouts interested
                  </div>

                  {/* Scout view: RSVP button */}
                  <motion.button
                    onClick={() => toggleRsvp(event.id)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: isSignedUp(event) ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                      border: `2px solid ${isSignedUp(event) ? '#ef4444' : 'var(--divider)'}`,
                      color: isSignedUp(event) ? '#ef4444' : 'var(--text-muted)',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isSignedUp(event) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = isSignedUp(event) ? 'rgba(239, 68, 68, 0.2)' : 'transparent';
                    }}
                  >
                    <Heart
                      size={18}
                      fill={isSignedUp(event) ? '#ef4444' : 'none'}
                      stroke="currentColor"
                    />
                    {isSignedUp(event) ? 'Interested' : 'Mark Interested'}
                  </motion.button>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
