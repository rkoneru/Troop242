import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit2, Shield, ShieldOff } from 'lucide-react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { loadData, saveData, generateId, DEFAULT_STATS, DEFAULT_LEADERS, DEFAULT_EVENTS, DEFAULT_ANNOUNCEMENTS } from '../utils/adminData';
import { THEMES } from '../utils/themes';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // Check authentication on mount
  useEffect(() => {
    if (loading) return;
    if (!user || profile?.role !== 'admin') {
      navigate('/member-login');
    }
  }, [user, profile, loading, navigate]);

  // Tab state
  const [activeTab, setActiveTab] = useState('stats');

  // Theme state
  const [defaultTheme, setDefaultTheme] = useState(() => localStorage.getItem('troopThemeDefault') || 'current');

  // Stats state
  const [stats, setStats] = useState(() => loadData('troop_stats', DEFAULT_STATS));
  const [statsForm, setStatsForm] = useState(stats);

  // Users state (Firestore)
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Announcements state
  const [announcements, setAnnouncements] = useState(() => loadData('troop_announcements', DEFAULT_ANNOUNCEMENTS));
  const [annForm, setAnnForm] = useState({ title: '', body: '', date: '', pinned: false });

  // Events state
  const [events, setEvents] = useState(() => loadData('troop_events', DEFAULT_EVENTS));
  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '', description: '' });

  // Leaders state
  const [leaders, setLeaders] = useState(() => loadData('troop_leaders', DEFAULT_LEADERS));
  const [leaderForm, setLeaderForm] = useState({ role: '', name: '', experience: '', bio: '' });
  const [editingLeader, setEditingLeader] = useState(null);

  // Load users from Firestore
  useEffect(() => {
    if (loading) return;

    const loadUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log('✓ Loaded users:', loaded);
        setUsers(loaded);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, [loading]);

  // Save handlers
  const handleSaveStats = () => {
    saveData('troop_stats', statsForm);
    setStats(statsForm);
  };

  const handleAddAnnouncement = () => {
    if (annForm.title && annForm.body) {
      const newAnnouncements = [...announcements, { id: generateId(), ...annForm }];
      setAnnouncements(newAnnouncements);
      saveData('troop_announcements', newAnnouncements);
      setAnnForm({ title: '', body: '', date: '', pinned: false });
    }
  };

  const handleDeleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveData('troop_announcements', updated);
  };

  const handleAddEvent = () => {
    if (eventForm.title && eventForm.date) {
      const newEvents = [...events, { id: generateId(), ...eventForm }];
      setEvents(newEvents);
      saveData('troop_events', newEvents);
      setEventForm({ title: '', date: '', location: '', description: '' });
    }
  };

  const handleDeleteEvent = (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveData('troop_events', updated);
  };

  const handleAddLeader = () => {
    if (leaderForm.role && leaderForm.name) {
      const newLeaders = [...leaders, { id: generateId(), ...leaderForm }];
      setLeaders(newLeaders);
      saveData('troop_leaders', newLeaders);
      setLeaderForm({ role: '', name: '', experience: '', bio: '' });
    }
  };

  const handleUpdateLeader = (id) => {
    const updated = leaders.map(l => l.id === id ? { ...l, ...leaderForm } : l);
    setLeaders(updated);
    saveData('troop_leaders', updated);
    setEditingLeader(null);
    setLeaderForm({ role: '', name: '', experience: '', bio: '' });
  };

  const handleDeleteLeader = (id) => {
    const updated = leaders.filter(l => l.id !== id);
    setLeaders(updated);
    saveData('troop_leaders', updated);
  };

  // User role handlers
  const handlePromoteToLeader = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: 'leader' });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'leader' } : u));
    } catch (error) {
      console.error('Error promoting user:', error);
    }
  };

  const handleDemoteToScout = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: 'scout' });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'scout' } : u));
    } catch (error) {
      console.error('Error demoting user:', error);
    }
  };

  const handleDisableUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status: 'rejected' });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Header */}
      <section className="section section--dark" style={{ paddingTop: 60 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>⚙️ Admin Dashboard</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Manage announcements, events, troop stats, and leader information
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section section--dark">
        <div className="container">
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['stats', 'users', 'announcements', 'events', 'leaders', 'theme'].map(tab => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 24px',
                  background: activeTab === tab ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab ? '#000' : 'var(--text-muted)',
                  border: `2px solid ${activeTab === tab ? 'var(--accent)' : 'var(--divider)'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === 'announcements' ? 'Announcements' : tab === 'leaders' ? 'Leaders' : tab === 'theme' ? '🎨 Theme' : tab === 'users' ? '👥 Users' : tab}
              </motion.button>
            ))}
          </div>

          {/* TAB: STATS */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card" style={{ padding: 32 }}>
                <h2 style={{ marginBottom: 32 }}>Edit Troop Statistics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
                  {[
                    { label: 'Eagle Scout Alumni', key: 'eagleScouts' },
                    { label: 'Active Scouts', key: 'activeScouts' },
                    { label: 'Years of Service', key: 'yearsServing' }
                  ].map(stat => (
                    <div key={stat.key}>
                      <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                        {stat.label}
                      </label>
                      <input
                        type="text"
                        value={statsForm[stat.key]}
                        onChange={(e) => setStatsForm({ ...statsForm, [stat.key]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          borderRadius: 8,
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={handleSaveStats}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Stats
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card" style={{ padding: 32 }}>
                <h2 style={{ marginBottom: 24 }}>User Management</h2>
                {isLoadingUsers ? (
                  <p>Loading users...</p>
                ) : users.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No users found</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                          <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Name</th>
                          <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Email</th>
                          <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Role</th>
                          <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Status</th>
                          <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid var(--divider)' }}>
                            <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{u.name}</td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: 4,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : u.role === 'leader' ? 'rgba(82, 183, 136, 0.2)' : 'rgba(100, 150, 200, 0.2)',
                                color: u.role === 'admin' ? '#ef4444' : u.role === 'leader' ? '#52b788' : '#6496c8'
                              }}>
                                {u.role || 'scout'}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: 4,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: u.status === 'approved' ? 'rgba(82, 183, 136, 0.2)' : u.status === 'pending' ? 'rgba(212, 168, 83, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: u.status === 'approved' ? '#52b788' : u.status === 'pending' ? '#d4a853' : '#ef4444'
                              }}>
                                {u.status || 'approved'}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {u.role !== 'leader' && u.role !== 'admin' && (
                                  <button
                                    onClick={() => handlePromoteToLeader(u.id)}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'rgba(82, 183, 136, 0.2)',
                                      color: '#52b788',
                                      border: '1px solid rgba(82, 183, 136, 0.3)',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <Shield size={14} /> Promote
                                  </button>
                                )}
                                {u.role === 'leader' && (
                                  <button
                                    onClick={() => handleDemoteToScout(u.id)}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'rgba(100, 150, 200, 0.2)',
                                      color: '#6496c8',
                                      border: '1px solid rgba(100, 150, 200, 0.3)',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <ShieldOff size={14} /> Demote
                                  </button>
                                )}
                                {u.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleDisableUser(u.id)}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'rgba(239, 68, 68, 0.2)',
                                      color: '#ef4444',
                                      border: '1px solid rgba(239, 68, 68, 0.3)',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: 600
                                    }}
                                  >
                                    Disable
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <motion.div
              key="announcements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add Announcement Form */}
              <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
                <h2 style={{ marginBottom: 24 }}>Add Announcement</h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={annForm.title}
                      onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                      placeholder="Announcement title"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                      Content
                    </label>
                    <textarea
                      value={annForm.body}
                      onChange={(e) => setAnnForm({ ...annForm, body: e.target.value })}
                      placeholder="Announcement text"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        minHeight: 100,
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={annForm.date}
                        onChange={(e) => setAnnForm({ ...annForm, date: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          borderRadius: 8,
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <input
                          type="checkbox"
                          checked={annForm.pinned}
                          onChange={(e) => setAnnForm({ ...annForm, pinned: e.target.checked })}
                          style={{ cursor: 'pointer' }}
                        />
                        Pin this announcement
                      </label>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleAddAnnouncement}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--accent)',
                      color: '#000',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      width: 'fit-content'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} /> Add Announcement
                  </motion.button>
                </div>
              </div>

              {/* Announcements List */}
              {announcements.length > 0 && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <h3 style={{ marginBottom: 16 }}>Current Announcements ({announcements.length})</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {announcements.map(ann => (
                      <motion.div
                        key={ann.id}
                        variants={itemVariants}
                        className="glass-card"
                        style={{ padding: 20 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <h4 style={{ margin: 0 }}>{ann.title}</h4>
                              {ann.pinned && (
                                <span style={{
                                  background: 'var(--accent)',
                                  color: '#000',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}>
                                  PINNED
                                </span>
                              )}
                            </div>
                            <p style={{ color: 'var(--text-muted)', margin: 0, marginBottom: 8 }}>{ann.body}</p>
                            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>{ann.date}</p>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff6b6b',
                              cursor: 'pointer',
                              padding: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB: EVENTS */}
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add Event Form */}
              <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
                <h2 style={{ marginBottom: 24 }}>Add Event</h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="e.g., Spring Campout"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          borderRadius: 8,
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        placeholder="e.g., Lake Park, Sanford"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          borderRadius: 8,
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                      Description
                    </label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="Event details"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        minHeight: 80,
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <motion.button
                    onClick={handleAddEvent}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--accent)',
                      color: '#000',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      width: 'fit-content'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} /> Add Event
                  </motion.button>
                </div>
              </div>

              {/* Events List */}
              {events.length > 0 && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <h3 style={{ marginBottom: 16 }}>Upcoming Events ({events.length})</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {events.map(evt => (
                      <motion.div
                        key={evt.id}
                        variants={itemVariants}
                        className="glass-card"
                        style={{ padding: 20 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px 0' }}>{evt.title}</h4>
                            <p style={{ color: 'var(--text-muted)', margin: 0, marginBottom: 4 }}>
                              📅 {evt.date}
                            </p>
                            <p style={{ color: 'var(--text-muted)', margin: 0, marginBottom: 4 }}>
                              📍 {evt.location}
                            </p>
                            {evt.description && (
                              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>{evt.description}</p>
                            )}
                          </div>
                          <motion.button
                            onClick={() => handleDeleteEvent(evt.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff6b6b',
                              cursor: 'pointer',
                              padding: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB: LEADERS */}
          {activeTab === 'leaders' && (
            <motion.div
              key="leaders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add/Edit Leader Form */}
              <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
                <h2 style={{ marginBottom: 24 }}>
                  {editingLeader ? 'Edit Leader' : 'Add Leader'}
                </h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                        Role
                      </label>
                      <input
                        type="text"
                        value={leaderForm.role}
                        onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                        placeholder="e.g., Scoutmaster"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          borderRadius: 8,
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={leaderForm.name}
                        onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                        placeholder="Full name"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          borderRadius: 8,
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                      Experience
                    </label>
                    <input
                      type="text"
                      value={leaderForm.experience}
                      onChange={(e) => setLeaderForm({ ...leaderForm, experience: e.target.value })}
                      placeholder="e.g., 15+ years in scouting"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600 }}>
                      Bio
                    </label>
                    <textarea
                      value={leaderForm.bio}
                      onChange={(e) => setLeaderForm({ ...leaderForm, bio: e.target.value })}
                      placeholder="Brief biography"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        minHeight: 80,
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button
                      onClick={() => {
                        if (editingLeader) {
                          handleUpdateLeader(editingLeader);
                        } else {
                          handleAddLeader();
                        }
                      }}
                      style={{
                        padding: '12px 24px',
                        background: 'var(--accent)',
                        color: '#000',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} /> {editingLeader ? 'Save Changes' : 'Add Leader'}
                    </motion.button>
                    {editingLeader && (
                      <motion.button
                        onClick={() => {
                          setEditingLeader(null);
                          setLeaderForm({ role: '', name: '', experience: '', bio: '' });
                        }}
                        style={{
                          padding: '12px 24px',
                          background: 'transparent',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--divider)',
                          borderRadius: 8,
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 600
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Leaders List */}
              {leaders.length > 0 && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <h3 style={{ marginBottom: 16 }}>Troop Leaders ({leaders.length})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {leaders.map(leader => (
                      <motion.div
                        key={leader.id}
                        variants={itemVariants}
                        className="glass-card"
                        style={{ padding: 20 }}
                      >
                        <div style={{ marginBottom: 16 }}>
                          <h4 style={{ margin: '0 0 4px 0', color: 'var(--accent)' }}>{leader.role}</h4>
                          <h3 style={{ margin: '0 0 8px 0' }}>{leader.name}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                            {leader.experience}
                          </p>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                          {leader.bio}
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <motion.button
                            onClick={() => {
                              setEditingLeader(leader.id);
                              setLeaderForm(leader);
                            }}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--accent)',
                              color: 'var(--accent)',
                              cursor: 'pointer',
                              padding: '8px 12px',
                              borderRadius: 6,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: '0.85rem',
                              fontWeight: 600
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit2 size={14} /> Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteLeader(leader.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff6b6b',
                              cursor: 'pointer',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB: THEME */}
          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                <h2 style={{ marginBottom: 24 }}>🎨 Set Default Theme</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Choose the default theme for all visitors. Users can override this in their Appearance settings.</p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}
                >
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <motion.div
                      key={key}
                      variants={itemVariants}
                      onClick={() => {
                        localStorage.setItem('troopThemeDefault', key);
                        setDefaultTheme(key);
                        const tokens = theme.tokens;
                        Object.entries(tokens).forEach(([prop, val]) => {
                          document.documentElement.style.setProperty(prop, val);
                        });
                      }}
                      className="glass-card"
                      style={{
                        padding: 24,
                        cursor: 'pointer',
                        border: defaultTheme === key ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '120px',
                          borderRadius: '12px',
                          backgroundColor: theme.tokens['--bg-primary'],
                          marginBottom: 16,
                          border: `2px solid ${theme.tokens['--glass-border']}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: theme.tokens['--accent'],
                            boxShadow: `0 0 20px ${theme.tokens['--accent']}80`
                          }}
                        />
                      </div>
                      <h3 style={{ marginBottom: 8, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                        {theme.name}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
                        {theme.description}
                      </p>
                      {defaultTheme === key && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            backgroundColor: 'var(--accent-dim)',
                            borderRadius: '8px',
                            color: 'var(--accent)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            justifyContent: 'center'
                          }}
                        >
                          <span>✓</span>
                          <span>Active Default</span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
