import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Users, MapPin, Calendar } from 'lucide-react';
import { loadData, saveData, generateId } from '../utils/adminData';

export default function ActivitiesPage() {
  const navigate = useNavigate();

  // Auth guard
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = sessionStorage.getItem('loggedInUser');
    if (!stored) {
      navigate('/member-login');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.profile !== 'scout' && parsed.profile !== 'leader') {
        navigate('/member-login');
        return;
      }
      setUser(parsed);
    } catch {
      navigate('/member-login');
    }
  }, [navigate]);

  // State
  const [activities, setActivities] = useState(() => loadData('troopActivities', []));
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '', spots: '' });
  const [signupConfirmed, setSignupConfirmed] = useState({});

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
    const userName = user?.name || user?.email || 'Scout';
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'var(--bg-secondary)', borderBottom: `1px solid var(--divider)`, zIndex: 100, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.button
            className="btn btn-outline"
            onClick={() => navigate(backRoute)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Troop Activities</h1>
          <div style={{ width: 120 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* LEADER VIEW */}
        {user.profile === 'leader' && (
          <>
            {/* Create Activity Form */}
            <motion.div
              className="glass-card"
              style={{ padding: 32, marginBottom: 48 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: 24 }}>Create New Activity</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="Activity Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    padding: 12,
                    border: `1px solid var(--divider)`,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                  }}
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={{
                    padding: 12,
                    border: `1px solid var(--divider)`,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{
                    padding: 12,
                    border: `1px solid var(--divider)`,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                  }}
                />
                <input
                  type="number"
                  placeholder="Spots Available"
                  value={form.spots}
                  onChange={(e) => setForm({ ...form, spots: e.target.value })}
                  style={{
                    padding: 12,
                    border: `1px solid var(--divider)`,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <textarea
                placeholder="Activity Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{
                  width: '100%',
                  height: 100,
                  padding: 12,
                  border: `1px solid var(--divider)`,
                  background: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  borderRadius: 8,
                  fontSize: '0.95rem',
                  marginBottom: 16,
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
              />

              <motion.button
                className="btn btn-primary"
                onClick={handleCreateActivity}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Plus size={18} /> Create Activity
              </motion.button>
            </motion.div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Upcoming Activities</h2>
          </>
        )}

        {/* ACTIVITY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {activities.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <p>No activities yet. {user?.profile === 'leader' ? 'Create one above!' : 'Check back soon!'}</p>
            </div>
          ) : (
            activities.map((activity) => (
              <motion.div
                key={activity.id}
                className="glass-card"
                style={{ padding: 24 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 0, marginBottom: 12, color: 'var(--text-main)' }}>
                  {activity.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Calendar size={16} /> {activity.date}
                </div>

                {activity.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <MapPin size={16} /> {activity.location}
                  </div>
                )}

                {activity.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 12, marginTop: 8 }}>
                    {activity.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    background: 'var(--bg-primary)',
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: '0.9rem',
                    color: isFull(activity) ? '#ef4444' : 'var(--accent)',
                  }}
                >
                  <Users size={16} /> {activity.signups.length}/{activity.spots} Spots {isFull(activity) ? '(Full)' : 'Available'}
                </div>

                {/* Leader view: show signups */}
                {user?.profile === 'leader' && activity.signups.length > 0 && (
                  <div style={{ marginBottom: 16, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: 500, marginBottom: 8 }}>Signed Up:</p>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
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
                        className="btn btn-primary"
                        onClick={() => handleSignup(activity.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ width: '100%' }}
                      >
                        Sign Up
                      </motion.button>
                    )}
                    {isSignedUp(activity) && (
                      <div style={{ padding: 12, textAlign: 'center', background: 'var(--bg-primary)', borderRadius: 8, color: 'var(--accent)', fontWeight: 600 }}>
                        ✓ Signed Up!
                      </div>
                    )}
                    {isFull(activity) && !isSignedUp(activity) && (
                      <div style={{ padding: 12, textAlign: 'center', background: 'var(--bg-primary)', borderRadius: 8, color: '#ef4444', fontWeight: 600 }}>
                        Activity Full
                      </div>
                    )}
                  </>
                )}

                {/* Leader view: delete button */}
                {user?.profile === 'leader' && (
                  <motion.button
                    className="btn btn-outline"
                    onClick={() => handleDeleteActivity(activity.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ef4444', borderColor: '#ef4444' }}
                  >
                    <Trash2 size={16} /> Delete
                  </motion.button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
