
import { CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveData, loadData, generateId, DEFAULT_EVENTS } from '../utils/adminData';

const SCOUTS_DATA = [
  {
    id: 1,
    name: 'John Smith',
    rank: 'Star Scout',
    activities: ['Camping Trip', 'Hiking Expedition'],
    status: 'approved',
    joinDate: '2025-01-15'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    rank: 'Life Scout',
    activities: ['Car Wash', 'Community Service'],
    status: 'pending',
    joinDate: '2025-03-01'
  },
  {
    id: 3,
    name: 'Sarah Davis',
    rank: 'First Class',
    activities: ['Chop & Sell', 'Skill Workshop'],
    status: 'approved',
    joinDate: '2025-02-10'
  },
  {
    id: 4,
    name: 'Tom Wilson',
    rank: 'Tenderfoot',
    activities: ['Camping Trip'],
    status: 'pending',
    joinDate: '2025-03-05'
  },
  {
    id: 5,
    name: 'Lisa Brown',
    rank: 'Scout',
    activities: ['Hiking Expedition', 'Skill Workshop'],
    status: 'approved',
    joinDate: '2025-01-20'
  }
];

const ACTIVITY_SIGNUPS = [
  {
    id: 1,
    activity: 'Camping Trip',
    date: '2026-04-15',
    scouts: ['John Smith', 'Tom Wilson', 'Lisa Brown'],
    pendingApprovals: 1,
    totalCapacity: 20,
    status: 'active'
  },
  {
    id: 2,
    activity: 'Car Wash',
    date: '2026-03-22',
    scouts: ['Mike Johnson', 'Sarah Davis'],
    pendingApprovals: 1,
    totalCapacity: 15,
    status: 'active'
  },
  {
    id: 3,
    activity: 'Chop & Sell',
    date: '2026-03-29',
    scouts: ['Sarah Davis'],
    pendingApprovals: 0,
    totalCapacity: 25,
    status: 'active'
  }
];

export default function LeaderDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('scouts');
  const [scoutsData, setScoutsData] = useState(SCOUTS_DATA);
  const [events, setEvents] = useState(() => loadData('troop_events', DEFAULT_EVENTS));
  const [invitations, setInvitations] = useState([]);
  const [newEventForm, setNewEventForm] = useState({ title: '', date: '', time: '', location: '', description: '' });
  const [newInvitationForm, setNewInvitationForm] = useState({ name: '', email: '', type: 'scout', tempPassword: '' });

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      navigate('/member-login');
      return;
    }
    try {
      const user = JSON.parse(loggedInUser);
      if (user.profile !== 'leader') {
        navigate('/member-login');
      }
    } catch {
      navigate('/member-login');
    }
  }, [navigate]);

  const handleApprove = (scoutId) => {
    setScoutsData(scoutsData.map(scout =>
      scout.id === scoutId ? { ...scout, status: 'approved' } : scout
    ));
  };

  const handleReject = (scoutId) => {
    setScoutsData(scoutsData.filter(scout => scout.id !== scoutId));
  };

  const generateTempPassword = () => {
    return Math.random().toString(36).slice(2, 10).toUpperCase();
  };

  const handleCreateEvent = () => {
    if (newEventForm.title && newEventForm.date && newEventForm.time) {
      const newEvent = {
        id: generateId(),
        ...newEventForm,
        createdAt: new Date().toISOString()
      };
      const updated = [...events, newEvent];
      setEvents(updated);
      saveData('troop_events', updated);
      setNewEventForm({ title: '', date: '', time: '', location: '', description: '' });
    }
  };

  const handleCreateInvitation = () => {
    if (newInvitationForm.name && newInvitationForm.email) {
      const tempPassword = generateTempPassword();
      const newInvitation = {
        id: invitations.length + 1,
        ...newInvitationForm,
        tempPassword,
        status: 'sent',
        createdAt: new Date().toISOString()
      };
      setInvitations([...invitations, newInvitation]);
      setNewInvitationForm({ name: '', email: '', type: 'scout', tempPassword: '' });
    }
  };

  const getNextTuesdayWithTime = () => {
    const today = new Date();
    let nextTuesday = new Date(today);
    const day = nextTuesday.getDay();
    const daysUntilTuesday = (2 - day + 7) % 7 || 7;
    nextTuesday.setDate(nextTuesday.getDate() + daysUntilTuesday);
    nextTuesday.setHours(19, 0, 0, 0);
    return nextTuesday;
  };

  const tuesdayMeeting = {
    id: 'tuesday-meeting',
    title: 'Weekly Troop Meeting',
    date: getNextTuesdayWithTime().toISOString().split('T')[0],
    time: '7:00 PM EST',
    location: '3512 S Orlando Dr, Sanford, FL 32773',
    description: 'Regular weekly troop meeting',
    recurring: 'Every Tuesday'
  };

  const pendingCount = scoutsData.filter(s => s.status === 'pending').length;
  const approvedCount = scoutsData.filter(s => s.status === 'approved').length;
  const totalActivitySignups = ACTIVITY_SIGNUPS.reduce((sum, a) => sum + a.scouts.length, 0);
  const allEvents = [tuesdayMeeting, ...events];

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
            <h1 style={{ marginBottom: 16 }}>📊 Leader Dashboard</h1>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
              Manage scouts, activities, and approvals for Troop 242
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
              marginBottom: 48
            }}
          >
            <div style={{ padding: 24, background: 'rgba(0, 214, 143, 0.1)', borderRadius: 12, border: '1px solid rgba(0, 214, 143, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Users size={24} style={{ color: '#00d68f' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Total Scouts</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00d68f' }}>{scoutsData.length}</p>
            </div>

            <div style={{ padding: 24, background: 'rgba(82, 183, 136, 0.1)', borderRadius: 12, border: '1px solid rgba(82, 183, 136, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <CheckCircle size={24} style={{ color: '#52b788' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Approved</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#52b788' }}>{approvedCount}</p>
            </div>

            <div style={{ padding: 24, background: 'rgba(212, 168, 83, 0.1)', borderRadius: 12, border: '1px solid rgba(212, 168, 83, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Clock size={24} style={{ color: '#d4a853' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Pending</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a853' }}>{pendingCount}</p>
            </div>

            <div style={{ padding: 24, background: 'rgba(100, 150, 200, 0.1)', borderRadius: 12, border: '1px solid rgba(100, 150, 200, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <TrendingUp size={24} style={{ color: '#6496c8' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Total Signups</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#6496c8' }}>{totalActivitySignups}</p>
            </div>
          </motion.div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTab('scouts')}
              style={{
                padding: '10px 20px',
                background: selectedTab === 'scouts' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
                border: selectedTab === 'scouts' ? '1px solid rgba(0, 214, 143, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedTab === 'scouts' ? '#00d68f' : '#9ca3af',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              👥 Scouts ({scoutsData.length})
            </button>
            <button
              onClick={() => setSelectedTab('activities')}
              style={{
                padding: '10px 20px',
                background: selectedTab === 'activities' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
                border: selectedTab === 'activities' ? '1px solid rgba(0, 214, 143, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedTab === 'activities' ? '#00d68f' : '#9ca3af',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              📅 Activities ({ACTIVITY_SIGNUPS.length})
            </button>
            <button
              onClick={() => setSelectedTab('events')}
              style={{
                padding: '10px 20px',
                background: selectedTab === 'events' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
                border: selectedTab === 'events' ? '1px solid rgba(0, 214, 143, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedTab === 'events' ? '#00d68f' : '#9ca3af',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              📆 Events ({allEvents.length})
            </button>
            <button
              onClick={() => setSelectedTab('invitations')}
              style={{
                padding: '10px 20px',
                background: selectedTab === 'invitations' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
                border: selectedTab === 'invitations' ? '1px solid rgba(0, 214, 143, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedTab === 'invitations' ? '#00d68f' : '#9ca3af',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              ✉️ Invitations ({invitations.length})
            </button>
          </div>

          {/* Scouts Tab */}
          {selectedTab === 'scouts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20
              }}
            >
              {scoutsData.map((scout) => (
                <div
                  key={scout.id}
                  className="glass-card"
                  style={{
                    padding: 24,
                    border: scout.status === 'pending' ? '2px solid #d4a853' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ color: '#fff', marginBottom: 4 }}>{scout.name}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{scout.rank}</p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      background: scout.status === 'pending' ? 'rgba(212, 168, 83, 0.2)' : 'rgba(0, 214, 143, 0.2)',
                      color: scout.status === 'pending' ? '#d4a853' : '#00d68f',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {scout.status === 'pending' ? '⏳ Pending' : '✓ Approved'}
                    </span>
                  </div>

                  <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 8 }}>Activities:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {scout.activities.map((activity, idx) => (
                        <span key={idx} style={{
                          padding: '4px 10px',
                          background: 'rgba(0, 214, 143, 0.1)',
                          color: '#00d68f',
                          borderRadius: 6,
                          fontSize: '0.75rem'
                        }}>
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {scout.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleApprove(scout.id)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: 'rgba(0, 214, 143, 0.2)',
                          color: '#00d68f',
                          border: '1px solid rgba(0, 214, 143, 0.3)',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(0, 214, 143, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(0, 214, 143, 0.2)';
                        }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(scout.id)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: 'rgba(255, 100, 100, 0.2)',
                          color: '#ff6464',
                          border: '1px solid rgba(255, 100, 100, 0.3)',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 100, 100, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255, 100, 100, 0.2)';
                        }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Activities Tab */}
          {selectedTab === 'activities' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 20
              }}
            >
              {ACTIVITY_SIGNUPS.map((activity) => (
                <div
                  key={activity.id}
                  className="glass-card"
                  style={{ padding: 24 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ color: '#fff', marginBottom: 4 }}>{activity.activity}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                        {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(0, 214, 143, 0.2)',
                      color: '#00d68f',
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {activity.scouts.length}/{activity.totalCapacity}
                    </span>
                  </div>

                  {activity.pendingApprovals > 0 && (
                    <div style={{
                      padding: 12,
                      background: 'rgba(212, 168, 83, 0.1)',
                      borderLeft: '3px solid #d4a853',
                      borderRadius: 6,
                      marginBottom: 16
                    }}>
                      <p style={{ color: '#d4a853', fontSize: '0.85rem', fontWeight: 600 }}>
                        ⚠ {activity.pendingApprovals} pending approval{activity.pendingApprovals !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 12 }}>Registered Scouts:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activity.scouts.map((scout, idx) => (
                        <div key={idx} style={{
                          padding: '10px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 6,
                          fontSize: '0.9rem',
                          color: '#d1d5db',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <CheckCircle size={16} style={{ color: '#00d68f' }} />
                          {scout}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Events Tab */}
          {selectedTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Create Event Form */}
              <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
                <h3 style={{ color: '#fff', marginBottom: 24 }}>➕ Create New Event</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={newEventForm.title}
                    onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: 8,
                      fontFamily: 'inherit'
                    }}
                  />
                  <input
                    type="date"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: 8,
                      fontFamily: 'inherit'
                    }}
                  />
                  <input
                    type="time"
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: 8,
                      fontFamily: 'inherit'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newEventForm.location}
                    onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: 8,
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <textarea
                  placeholder="Event Description"
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    borderRadius: 8,
                    fontFamily: 'inherit',
                    minHeight: '100px',
                    marginBottom: 16
                  }}
                />
                <button
                  onClick={handleCreateEvent}
                  style={{
                    padding: '12px 32px',
                    background: 'rgba(0, 214, 143, 0.2)',
                    color: '#00d68f',
                    border: '1px solid rgba(0, 214, 143, 0.3)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 214, 143, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0, 214, 143, 0.2)';
                  }}
                >
                  ➕ Create Event
                </button>
              </div>

              {/* Events List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {allEvents.map((event) => (
                  <div key={event.id} className="glass-card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <div>
                        <h3 style={{ color: '#fff', marginBottom: 4 }}>{event.title}</h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{event.date}</p>
                      </div>
                      {event.id === 'tuesday-meeting' && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'rgba(0, 214, 143, 0.2)',
                          color: '#00d68f',
                          borderRadius: 20,
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          📌 Recurring
                        </span>
                      )}
                    </div>
                    <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>⏰ {event.time}</p>
                      <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>📍 {event.location}</p>
                    </div>
                    {event.description && (
                      <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.5 }}>{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Invitations Tab */}
          {selectedTab === 'invitations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Send Invitation Form */}
              <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
                <h3 style={{ color: '#fff', marginBottom: 24 }}>✉️ Invite Scouts & Parents</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newInvitationForm.name}
                    onChange={(e) => setNewInvitationForm({ ...newInvitationForm, name: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: 8,
                      fontFamily: 'inherit'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newInvitationForm.email}
                    onChange={(e) => setNewInvitationForm({ ...newInvitationForm, email: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: 8,
                      fontFamily: 'inherit'
                    }}
                  />
                  <select
                    value={newInvitationForm.type}
                    onChange={(e) => setNewInvitationForm({ ...newInvitationForm, type: e.target.value })}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: 8,
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value="scout" style={{ background: '#050a24' }}>Scout</option>
                    <option value="parent" style={{ background: '#050a24' }}>Parent</option>
                    <option value="leader" style={{ background: '#050a24' }}>Leader</option>
                  </select>
                </div>
                <button
                  onClick={handleCreateInvitation}
                  style={{
                    padding: '12px 32px',
                    background: 'rgba(0, 214, 143, 0.2)',
                    color: '#00d68f',
                    border: '1px solid rgba(0, 214, 143, 0.3)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 214, 143, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0, 214, 143, 0.2)';
                  }}
                >
                  ✉️ Send Invitation
                </button>
              </div>

              {/* Invitations List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="glass-card" style={{ padding: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <h3 style={{ color: '#fff', marginBottom: 4 }}>{invitation.name}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{invitation.email}</p>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(0, 214, 143, 0.2)',
                        color: '#00d68f',
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block',
                        marginTop: 8
                      }}>
                        👤 {invitation.type.charAt(0).toUpperCase() + invitation.type.slice(1)}
                      </span>
                    </div>
                    <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 8 }}>Temporary Password:</p>
                      <div style={{
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(0, 214, 143, 0.2)',
                        borderRadius: 6,
                        fontFamily: 'monospace',
                        color: '#00d68f',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}>
                        {invitation.tempPassword}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {invitations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <p>No invitations sent yet. Create one to get started!</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
