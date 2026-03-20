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
        <h2 className="text-xl font-bold mb-5">Activities & Events</h2>

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
