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
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-10">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--divider)] z-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.button
            className="btn btn-outline"
            onClick={() => navigate(backRoute)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
          <h1 className="text-2xl font-semibold">Troop Activities</h1>
          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
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

        {/* ACTIVITY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.length === 0 ? (
            <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
              <p>No activities yet. {user?.profile === 'leader' ? 'Create one above!' : 'Check back soon!'}</p>
            </div>
          ) : (
            activities.map((activity) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
