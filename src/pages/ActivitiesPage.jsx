import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Users, MapPin, Calendar, Heart } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { loadData, saveData, generateId } from '../utils/adminData';
import { useAuth } from '../contexts/AuthContext';

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Get user display name
  const userName = user?.displayName || user?.email || profile?.name || 'Scout';

  // State
  const [activities, setActivities] = useState(() => loadData('troopActivities', []));
  const [events, setEvents] = useState([]);
  const [myRsvps, setMyRsvps] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '', spots: '' });
  const [signupConfirmed, setSignupConfirmed] = useState({});

  // Load events from localStorage (same as Calendar page)
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('troop_events');
      if (storedEvents) {
        const loaded = JSON.parse(storedEvents);
        setEvents(loaded.sort((a, b) => new Date(a.date) - new Date(b.date)));
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
    }
  }, []);

  // Load user's RSVPs from Firestore
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadRsvps = async () => {
      try {
        const snap = await getDoc(doc(db, 'eventRsvps', user.uid));
        if (snap.exists()) {
          setMyRsvps(snap.data());
        }
      } catch (error) {
        console.error('Error loading RSVPs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRsvps();
  }, [user]);

  // Toggle RSVP for an event
  const toggleRsvp = async (eventId) => {
    if (!user) return;

    const updated = { ...myRsvps };
    updated[eventId] = !updated[eventId];
    if (!updated[eventId]) delete updated[eventId];

    setMyRsvps(updated);

    try {
      await setDoc(doc(db, 'eventRsvps', user.uid), updated, { merge: true });
    } catch (error) {
      console.error('Error saving RSVP:', error);
    }
  };

  // Handlers
  const handleCreateActivity = () => {
    if (!form.title || !form.date) {
      alert('Please fill in title and date');
      return;
    }
    const newActivity = {
      id: generateId(),
      title: form.title,
      date: form.date,
      location: form.location,
      description: form.description,
      spots: parseInt(form.spots) || 20,
      signups: [],
    };
    const updated = [...activities, newActivity];
    setActivities(updated);
    saveData('troopActivities', updated);
    setForm({ title: '', date: '', location: '', description: '', spots: '' });
  };

  const handleDeleteActivity = (activityId) => {
    const updated = activities.filter((a) => a.id !== activityId);
    setActivities(updated);
    saveData('troopActivities', updated);
  };

  const handleSignup = (activityId) => {
    const updated = activities.map((act) =>
      act.id === activityId
        ? { ...act, signups: [...act.signups, userName] }
        : act
    );
    setActivities(updated);
    saveData('troopActivities', updated);

    // Update scoutSignups for ScoutDashboard stats
    const currentSignups = loadData('scoutSignups', []);
    const activity = activities.find((a) => a.id === activityId);
    if (activity && !currentSignups.includes(activity.title)) {
      saveData('scoutSignups', [...currentSignups, activity.title]);
    }

    // Show confirmation
    setSignupConfirmed({ ...signupConfirmed, [activityId]: true });
    setTimeout(() => {
      setSignupConfirmed({ ...signupConfirmed, [activityId]: false });
    }, 2000);
  };

  const isSignedUp = (activity) => {
    const userName = user?.name || user?.email || 'Scout';
    return activity.signups.includes(userName);
  };

  const isFull = (activity) => activity.signups.length >= activity.spots;

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
        {/* LEADER VIEW */}
        {user.profile === 'leader' && (
          <>
            {/* Create Activity Form */}
            <motion.div
              className="glass-card p-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mt-0 mb-6">Create New Activity</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Activity Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="px-3 py-3 border border-[var(--divider)] bg-[var(--bg-primary)] text-[var(--text-main)] rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="px-3 py-3 border border-[var(--divider)] bg-[var(--bg-primary)] text-[var(--text-main)] rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="px-3 py-3 border border-[var(--divider)] bg-[var(--bg-primary)] text-[var(--text-main)] rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Spots Available"
                  value={form.spots}
                  onChange={(e) => setForm({ ...form, spots: e.target.value })}
                  className="px-3 py-3 border border-[var(--divider)] bg-[var(--bg-primary)] text-[var(--text-main)] rounded-lg text-sm"
                />
              </div>

              <textarea
                placeholder="Activity Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-24 px-3 py-3 border border-[var(--divider)] bg-[var(--bg-primary)] text-[var(--text-main)] rounded-lg text-sm font-inherit mb-4 resize-none"
              />

              <motion.button
                className="btn btn-primary flex items-center gap-2"
                onClick={handleCreateActivity}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={18} /> Create Activity
              </motion.button>
            </motion.div>

            <h2 className="text-xl font-bold mb-5">Upcoming Activities</h2>
          </>
        )}

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
                    <Users size={16} /> {activity.signups.length}/{activity.spots} Spots {isFull(activity) ? '(Full)' : 'Available'}
                  </div>

                  {/* Leader view: show signups */}
                  {user?.profile === 'leader' && activity.signups.length > 0 && (
                    <div className="mb-4 text-sm text-[var(--text-muted)]">
                      <p className="font-medium mb-2">Signed Up:</p>
                      <ul className="m-0 pl-5">
                        {activity.signups.map((name, idx) => (
                          <li key={idx}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Scout view: sign up button */}
                  {user?.profile === 'scout' && (
                    <>
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
                    </>
                  )}

                  {/* Leader view: delete button */}
                  {user?.profile === 'leader' && (
                    <motion.button
                      className="btn btn-outline w-full flex items-center justify-center gap-2 text-red-500 border-red-500"
                      onClick={() => handleDeleteActivity(activity.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} /> Delete
                    </motion.button>
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

                  {/* Scout view: RSVP button */}
                  {user?.profile === 'scout' && (
                    <motion.button
                      onClick={() => toggleRsvp(event.id)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: myRsvps[event.id] ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                        border: `2px solid ${myRsvps[event.id] ? '#ef4444' : 'var(--divider)'}`,
                        color: myRsvps[event.id] ? '#ef4444' : 'var(--text-muted)',
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
                        e.target.style.background = myRsvps[event.id] ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = myRsvps[event.id] ? 'rgba(239, 68, 68, 0.2)' : 'transparent';
                      }}
                    >
                      <Heart
                        size={18}
                        fill={myRsvps[event.id] ? '#ef4444' : 'none'}
                        stroke="currentColor"
                      />
                      {myRsvps[event.id] ? 'Interested' : 'Mark Interested'}
                    </motion.button>
                  )}

                  {!user?.profile === 'scout' && (
                    <p className="text-[var(--text-muted)] text-sm text-center mt-4">
                      {event.signups && event.spots ? `${event.signups.length} interested` : 'Event'}
                    </p>
                  )}
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
