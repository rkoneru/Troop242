import { CheckCircle, Clock, Users, TrendingUp, Calendar, MapPin, Plus, Trash2, ChevronDown, ChevronUp, Search, Download, Upload, Check, X } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { saveData, loadData, generateId, DEFAULT_EVENTS, getEvents } from '../utils/adminData';
import {
  loadScouts,
  saveScouts,
  getScoutStats,
  searchScouts,
  generateScoutId,
  updateScout,
  deleteScout,
  getScoutsByStatus,
  exportScoutData,
  importScoutData
} from '../utils/leaderData';
import {
  validateActivityForm,
  validateEventForm,
  validateInvitationForm,
  validateEmail,
  validateScoutName,
  checkDuplicateScout,
  checkDuplicateActivity,
  isActivityFull,
  formatValidationErrors
} from '../utils/leaderValidation';

const RANKS = ['Scout', 'Tenderfoot', '2nd Class', '1st Class', 'Star', 'Life', 'Eagle'];

export default function LeaderDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // State management
  const [selectedTab, setSelectedTab] = useState('scouts');
  const [scoutsData, setScoutsData] = useState([]);
  const [events, setEvents] = useState(() => loadData('troop_events', DEFAULT_EVENTS));
  const [troopActivities, setTroopActivities] = useState(() => loadData('troopActivities', []));
  const [invitations, setInvitations] = useState(() => loadData('leaderInvitations', []));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRosters, setExpandedRosters] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoadingScouts, setIsLoadingScouts] = useState(true);

  // Form states
  const [newScoutForm, setNewScoutForm] = useState({ name: '', email: '', rank: 'Scout', phone: '', notes: '' });
  const [newEventForm, setNewEventForm] = useState({ title: '', date: '', time: '', location: '', description: '' });
  const [newInvitationForm, setNewInvitationForm] = useState({ name: '', email: '', type: 'scout' });
  const [newActivityForm, setNewActivityForm] = useState({ title: '', date: '', time: '', location: '', description: '', spots: '20', dues: '0' });

  // Load scouts from Firestore
  useEffect(() => {
    if (loading) return;

    const loadFirestoreScouts = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'users'), where('role', '==', 'scout'))
        );
        const loaded = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setScoutsData(loaded);
      } catch (error) {
        console.error('Error loading scouts:', error);
      } finally {
        setIsLoadingScouts(false);
      }
    };

    if (!user || !profile || profile.role !== 'leader') {
      navigate('/member-login');
      return;
    }

    loadFirestoreScouts();
  }, [user, profile, loading, navigate]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Computed values (memoized)
  const scoutStats = useMemo(() => getScoutStats(scoutsData), [scoutsData]);

  const filteredScouts = useMemo(() => {
    let filtered = scoutsData;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    if (searchQuery) {
      filtered = searchScouts(searchQuery, filtered);
    }

    return filtered;
  }, [scoutsData, filterStatus, searchQuery]);

  const totalActivitySignups = useMemo(
    () => troopActivities.reduce((sum, a) => sum + (a.signups?.length || 0), 0),
    [troopActivities]
  );

  // Handler functions
  const generateTempPassword = useCallback(() => {
    return Math.random().toString(36).slice(2, 10).toUpperCase();
  }, []);

  const showError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const showSuccess = useCallback((message) => {
    setSuccessMessage(message);
  }, []);

  // Scout approval handlers
  const handleApproveScout = async (scoutId) => {
    try {
      await updateDoc(doc(db, 'users', scoutId), { status: 'approved' });
      setScoutsData(prev =>
        prev.map(s => s.id === scoutId ? { ...s, status: 'approved' } : s)
      );
      showSuccess('Scout approved!');
    } catch (error) {
      console.error('Error approving scout:', error);
      showError('scout', 'Failed to approve scout');
    }
  };

  const handleRejectScout = async (scoutId) => {
    try {
      await updateDoc(doc(db, 'users', scoutId), { status: 'rejected' });
      setScoutsData(prev =>
        prev.map(s => s.id === scoutId ? { ...s, status: 'rejected' } : s)
      );
      showSuccess('Scout rejected');
    } catch (error) {
      console.error('Error rejecting scout:', error);
      showError('scout', 'Failed to reject scout');
    }
  };

  // SCOUT HANDLERS
  const handleAddScout = useCallback(() => {
    clearErrors();

    const nameVal = validateScoutName(newScoutForm.name);
    if (!nameVal.valid) {
      showError('name', nameVal.error);
      return;
    }

    const emailVal = validateEmail(newScoutForm.email);
    if (!emailVal.valid) {
      showError('email', emailVal.error);
      return;
    }

    const dupCheck = checkDuplicateScout(scoutsData, newScoutForm.email);
    if (dupCheck.isDuplicate) {
      showError('email', dupCheck.error);
      return;
    }

    const scout = {
      id: generateScoutId(),
      name: newScoutForm.name,
      email: newScoutForm.email,
      rank: newScoutForm.rank,
      phone: newScoutForm.phone,
      notes: newScoutForm.notes,
      status: 'pending',
      activities: [],
      joinDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setScoutsData([...scoutsData, scout]);
    setNewScoutForm({ name: '', email: '', rank: 'Scout', phone: '', notes: '' });
    showSuccess('Scout added successfully! Pending approval.');
  }, [newScoutForm, scoutsData, clearErrors, showError, showSuccess]);


  // ACTIVITY HANDLERS
  const handleCreateActivity = useCallback(() => {
    clearErrors();

    const validation = validateActivityForm(newActivityForm);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const dupCheck = checkDuplicateActivity(troopActivities, newActivityForm.title, newActivityForm.date);
    if (dupCheck.isDuplicate) {
      showError('title', dupCheck.error);
      return;
    }

    const activity = {
      id: generateId(),
      title: newActivityForm.title,
      date: newActivityForm.date,
      time: newActivityForm.time,
      location: newActivityForm.location,
      description: newActivityForm.description,
      spots: parseInt(newActivityForm.spots) || 20,
      dues: parseFloat(newActivityForm.dues) || 0,
      signups: [],
      duesPaid: [],
      createdAt: new Date().toISOString()
    };

    const updated = [...troopActivities, activity];
    setTroopActivities(updated);
    saveData('troopActivities', updated);
    setNewActivityForm({ title: '', date: '', time: '', location: '', description: '', spots: '20', dues: '0' });
    showSuccess('Activity created successfully!');
  }, [newActivityForm, troopActivities, clearErrors, showError, showSuccess]);

  const handleDeleteActivity = useCallback((activityId) => {
    const updated = troopActivities.filter((a) => a.id !== activityId);
    setTroopActivities(updated);
    saveData('troopActivities', updated);
    showSuccess('Activity deleted.');
  }, [troopActivities, showSuccess]);

  // EVENT HANDLERS
  const handleCreateEvent = useCallback(() => {
    clearErrors();

    const validation = validateEventForm(newEventForm);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const creatorName = profile?.name || 'Leader';

    const event = {
      id: generateId(),
      title: newEventForm.title,
      date: newEventForm.date,
      time: newEventForm.time,
      location: newEventForm.location,
      description: newEventForm.description,
      signups: [],
      spots: 100,
      createdBy: creatorName,
      createdAt: new Date().toISOString()
    };

    const updated = [...events, event];
    setEvents(updated);
    saveData('troop_events', updated);
    setNewEventForm({ title: '', date: '', time: '', location: '', description: '' });
    showSuccess('Event created successfully!');
  }, [newEventForm, events, clearErrors, showError, showSuccess]);

  const handleDeleteEvent = useCallback((eventId) => {
    const updated = events.filter(e => e.id !== eventId);
    setEvents(updated);
    saveData('troop_events', updated);
    showSuccess('Event deleted.');
  }, [events, showSuccess]);

  const handleAddEventSignup = useCallback((eventId) => {
    const updatedEvents = events.map(evt => {
      if (evt.id !== eventId) return evt;
      return {
        ...evt,
        signups: Array.isArray(evt.signups) ? evt.signups : []
      };
    });
    setEvents(updatedEvents);
    saveData('troop_events', updatedEvents);
  }, [events, showSuccess]);

  // INVITATION HANDLERS
  const handleCreateInvitation = useCallback(() => {
    clearErrors();

    const validation = validateInvitationForm(newInvitationForm);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const dupCheck = checkDuplicateScout(scoutsData, newInvitationForm.email);
    if (dupCheck.isDuplicate) {
      showError('email', 'Scout already exists');
      return;
    }

    const invitation = {
      id: invitations.length + 1,
      name: newInvitationForm.name,
      email: newInvitationForm.email,
      type: newInvitationForm.type,
      tempPassword: generateTempPassword(),
      status: 'sent',
      createdAt: new Date().toISOString()
    };

    const updated = [...invitations, invitation];
    setInvitations(updated);
    saveData('leaderInvitations', updated);
    setNewInvitationForm({ name: '', email: '', type: 'scout' });
    showSuccess('Invitation sent successfully!');
  }, [newInvitationForm, scoutsData, invitations, clearErrors, showError, showSuccess, generateTempPassword]);

  const handleCopyPassword = useCallback((password) => {
    navigator.clipboard.writeText(password);
    showSuccess('Password copied to clipboard!');
  }, [showSuccess]);

  // UTILITY HANDLERS
  const toggleRoster = useCallback((activityId) => {
    setExpandedRosters((prev) => ({ ...prev, [activityId]: !prev[activityId] }));
  }, []);

  const handleExportScouts = useCallback(() => {
    const csv = [
      ['Name', 'Email', 'Rank', 'Status', 'Join Date', 'Phone', 'Notes'],
      ...scoutsData.map(s => [s.name, s.email, s.rank, s.status, s.joinDate, s.phone, s.notes])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `scouts-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showSuccess('Scouts exported to CSV!');
  }, [scoutsData, showSuccess]);

  // Render helpers
  const ScoutCard = ({ scout }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '1rem' }}>{scout.name}</h4>
          <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '0.9rem' }}>
            {scout.rank} • {scout.email}
          </p>
          {scout.phone && (
            <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontSize: '0.85rem' }}>📞 {scout.phone}</p>
          )}
          {scout.notes && (
            <p style={{ margin: '0', color: '#9ca3af', fontSize: '0.85rem' }}>📝 {scout.notes}</p>
          )}
        </div>
        <div
          style={{
            padding: '4px 12px',
            background: scout.status === 'approved' ? 'rgba(82, 183, 136, 0.2)' : 'rgba(212, 168, 83, 0.2)',
            color: scout.status === 'approved' ? '#52b788' : '#d4a853',
            borderRadius: 6,
            fontSize: '0.8rem',
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}
        >
          {scout.status.charAt(0).toUpperCase() + scout.status.slice(1)}
        </div>
      </div>

      {scout.status === 'pending' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleApproveScout(scout.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'rgba(82, 183, 136, 0.2)',
              color: '#52b788',
              border: '1px solid rgba(82, 183, 136, 0.3)',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}
          >
            ✓ Approve
          </button>
          <button
            onClick={() => handleRejectScout(scout.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}
          >
            ✕ Reject
          </button>
        </div>
      )}
    </motion.div>
  );

  // Mark dues as paid
  const handleMarkDuesPaid = useCallback((activityId, scoutIndex) => {
    const updatedActivities = troopActivities.map(a => {
      if (a.id !== activityId) return a;
      const updated = { ...a };
      if (!updated.duesPaid) updated.duesPaid = [];
      const signup = a.signups?.[scoutIndex];
      if (signup && !updated.duesPaid.some(p => p.scoutName === signup.scoutName)) {
        updated.duesPaid.push({ scoutName: signup.scoutName, paidAt: new Date().toISOString() });
      }
      return updated;
    });
    setTroopActivities(updatedActivities);
    saveData('troopActivities', updatedActivities);
    showSuccess('Dues marked as paid!');
  }, [troopActivities, showSuccess]);

  const ActivityCard = ({ activity }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>{activity.title}</h4>
            {activity.dues > 0 && (
              <span style={{ background: 'rgba(212, 168, 83, 0.2)', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem', color: '#d4a853' }}>
                💰 ${activity.dues}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.9rem', color: '#9ca3af', marginBottom: 8, flexWrap: 'wrap' }}>
            <span>📅 {activity.date}</span>
            {activity.time && <span>🕐 {activity.time}</span>}
            {activity.location && <span>📍 {activity.location}</span>}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
            fontSize: '0.9rem'
          }}>
            <div style={{
              flex: 1,
              height: 8,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min((activity.signups?.length || 0) / activity.spots * 100, 100)}%`,
                background: isActivityFull(activity) ? '#ef4444' : '#52b788',
                transition: 'width 0.3s'
              }} />
            </div>
            <span style={{ color: '#9ca3af', minWidth: '60px' }}>
              {activity.signups?.length || 0}/{activity.spots}
            </span>
          </div>
          {activity.description && (
            <p style={{ margin: '0', color: '#9ca3af', fontSize: '0.85rem' }}>{activity.description}</p>
          )}
        </div>
        <button
          onClick={() => handleDeleteActivity(activity.id)}
          style={{
            padding: '6px 10px',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            marginLeft: 12
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <button
        onClick={() => toggleRoster(activity.id)}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'rgba(100, 150, 200, 0.2)',
          color: '#6496c8',
          border: '1px solid rgba(100, 150, 200, 0.3)',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s'
        }}
      >
        {expandedRosters[activity.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {expandedRosters[activity.id] ? 'Hide Roster' : 'View Roster'}
      </button>

      {expandedRosters[activity.id] && activity.signups && activity.signups.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 600, color: '#9ca3af' }}>Signups ({activity.signups.length}):</p>
          {activity.signups.map((signup, idx) => {
            const scoutName = typeof signup === 'object' ? signup.scoutName : signup;
            const isDuesPaid = activity.duesPaid?.some(p => p.scoutName === scoutName);
            return (
              <div key={idx} style={{ padding: '8px', marginBottom: 6, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  {scoutName}
                  {activity.dues > 0 && (
                    <span style={{ marginLeft: 8, fontSize: '0.75rem', color: isDuesPaid ? '#52b788' : '#d4a853' }}>
                      {isDuesPaid ? '✓ Paid' : `💰 $${activity.dues} due`}
                    </span>
                  )}
                </span>
                {activity.dues > 0 && !isDuesPaid && (
                  <button
                    onClick={() => handleMarkDuesPaid(activity.id, idx)}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(82, 183, 136, 0.2)',
                      color: '#52b788',
                      border: '1px solid rgba(82, 183, 136, 0.3)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  return (
    <>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.2), rgba(27, 67, 50, 0.05))', padding: '40px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ marginBottom: 8, marginTop: 0, fontSize: '2.5rem' }}>📊 Leader Dashboard</h1>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', margin: '0', maxWidth: '600px' }}>
              Manage scouts, activities, and approvals for Troop 242
            </p>
          </motion.div>
        </div>
      </section>

      {/* Messages */}
      {successMessage && (
        <div style={{
          padding: '12px 20px',
          background: 'rgba(82, 183, 136, 0.2)',
          color: '#52b788',
          borderBottom: '1px solid rgba(82, 183, 136, 0.3)',
          textAlign: 'center',
          fontSize: '0.95rem'
        }}>
          ✓ {successMessage}
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div style={{
          padding: '12px 20px',
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center',
          fontSize: '0.95rem'
        }}>
          {Object.values(errors)[0]}
        </div>
      )}

      {/* Stats */}
      <section style={{ padding: '40px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
              marginBottom: 32
            }}
          >
            <div style={{ padding: 24, background: 'rgba(0, 214, 143, 0.1)', borderRadius: 12, border: '1px solid rgba(0, 214, 143, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Users size={24} style={{ color: '#00d68f' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Total Scouts</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00d68f', margin: 0 }}>{scoutStats.total}</p>
            </div>

            <div style={{ padding: 24, background: 'rgba(82, 183, 136, 0.1)', borderRadius: 12, border: '1px solid rgba(82, 183, 136, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <CheckCircle size={24} style={{ color: '#52b788' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Approved</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#52b788', margin: 0 }}>{scoutStats.approved}</p>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '4px 0 0 0' }}>{scoutStats.approvalRate}% approval rate</p>
            </div>

            <div style={{ padding: 24, background: 'rgba(212, 168, 83, 0.1)', borderRadius: 12, border: '1px solid rgba(212, 168, 83, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Clock size={24} style={{ color: '#d4a853' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Pending</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a853', margin: 0 }}>{scoutStats.pending}</p>
            </div>

            <div style={{ padding: 24, background: 'rgba(100, 150, 200, 0.1)', borderRadius: 12, border: '1px solid rgba(100, 150, 200, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <TrendingUp size={24} style={{ color: '#6496c8' }} />
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Activity Signups</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#6496c8', margin: 0 }}>{totalActivitySignups}</p>
            </div>
          </motion.div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 16, flexWrap: 'wrap' }}>
            {['scouts', 'activities', 'events', 'invitations'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  padding: '10px 20px',
                  background: selectedTab === tab ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
                  border: selectedTab === tab ? '1px solid rgba(0, 214, 143, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: selectedTab === tab ? '#00d68f' : '#9ca3af',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'scouts' && `👥 Scouts (${scoutsData.length})`}
                {tab === 'activities' && `📅 Activities (${troopActivities.length})`}
                {tab === 'events' && `📆 Events (${events.length})`}
                {tab === 'invitations' && `📧 Invitations (${invitations.length})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* SCOUTS TAB */}
          {selectedTab === 'scouts' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Add Scout Form */}
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>➕ Add New Scout</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Scout Name *"
                    value={newScoutForm.name}
                    onChange={(e) => setNewScoutForm({ ...newScoutForm, name: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newScoutForm.email}
                    onChange={(e) => setNewScoutForm({ ...newScoutForm, email: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <select
                    value={newScoutForm.rank}
                    onChange={(e) => setNewScoutForm({ ...newScoutForm, rank: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  >
                    {RANKS.map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={newScoutForm.phone}
                    onChange={(e) => setNewScoutForm({ ...newScoutForm, phone: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  value={newScoutForm.notes}
                  onChange={(e) => setNewScoutForm({ ...newScoutForm, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    marginBottom: 12,
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleAddScout}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: 'rgba(0, 214, 143, 0.2)',
                      border: '1px solid rgba(0, 214, 143, 0.3)',
                      color: '#00d68f',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Plus size={18} style={{ display: 'inline', marginRight: 6 }} />
                    Add Scout
                  </button>
                  <button
                    onClick={handleExportScouts}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(100, 150, 200, 0.2)',
                      border: '1px solid rgba(100, 150, 200, 0.3)',
                      color: '#6496c8',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>

              {/* Filters and Search */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Search scouts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              {/* Scout List */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.1rem' }}>
                  Scouts ({filteredScouts.length})
                </h3>
                {filteredScouts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                    No scouts found. Add one above!
                  </div>
                ) : (
                  filteredScouts.map(scout => (
                    <ScoutCard key={scout.id} scout={scout} />
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ACTIVITIES TAB */}
          {selectedTab === 'activities' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Create Activity Form */}
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>➕ Create Activity</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Activity Title *"
                    value={newActivityForm.title}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, title: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="date"
                    value={newActivityForm.date}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, date: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="time"
                    value={newActivityForm.time}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, time: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newActivityForm.location}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, location: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Spots"
                    value={newActivityForm.spots}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, spots: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Dues ($)"
                    value={newActivityForm.dues}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, dues: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={newActivityForm.description}
                  onChange={(e) => setNewActivityForm({ ...newActivityForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    marginBottom: 12,
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={handleCreateActivity}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: 'rgba(0, 214, 143, 0.2)',
                    border: '1px solid rgba(0, 214, 143, 0.3)',
                    color: '#00d68f',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={18} style={{ display: 'inline', marginRight: 6 }} />
                  Create Activity
                </button>
              </div>

              {/* Activity List */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.1rem' }}>
                  Activities ({troopActivities.length})
                </h3>
                {troopActivities.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                    No activities yet. Create one above!
                  </div>
                ) : (
                  troopActivities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* EVENTS TAB */}
          {selectedTab === 'events' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Create Event Form */}
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>➕ Create Event</h3>
                <p style={{ margin: '0 0 16px 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                  📢 Events are shared with all scouts and allow RSVPs. Scouts can indicate interest when viewing events.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Event Title *"
                    value={newEventForm.title}
                    onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="date"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="time"
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newEventForm.location}
                    onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    marginBottom: 12,
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={handleCreateEvent}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: 'rgba(0, 214, 143, 0.2)',
                    border: '1px solid rgba(0, 214, 143, 0.3)',
                    color: '#00d68f',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={18} style={{ display: 'inline', marginRight: 6 }} />
                  Create Event
                </button>
              </div>

              {/* Event List */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.1rem' }}>
                  Events ({events.length})
                </h3>
                {events.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                    No events scheduled yet.
                  </div>
                ) : (
                  events.map(event => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 8px 0', color: '#fff' }}>{event.title}</h4>
                          {event.createdBy && (
                            <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                              👤 Created by: <span style={{ color: '#6496c8' }}>{event.createdBy}</span>
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: 16, fontSize: '0.9rem', color: '#9ca3af', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span>📅 {event.date}</span>
                            {event.time && <span>🕐 {event.time}</span>}
                            {event.location && <span>📍 {event.location}</span>}
                          </div>
                          {event.signups && event.signups.length > 0 && (
                            <div style={{ fontSize: '0.9rem', color: '#52b788', marginBottom: 8 }}>
                              ✓ {event.signups.length} scout{event.signups.length !== 1 ? 's' : ''} interested
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            marginLeft: 12,
                            flexShrink: 0
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {event.description && (
                        <p style={{ margin: '0', color: '#9ca3af', fontSize: '0.9rem' }}>📝 {event.description}</p>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* INVITATIONS TAB */}
          {selectedTab === 'invitations' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Send Invitation Form */}
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>📧 Send Invitation</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Name *"
                    value={newInvitationForm.name}
                    onChange={(e) => setNewInvitationForm({ ...newInvitationForm, name: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newInvitationForm.email}
                    onChange={(e) => setNewInvitationForm({ ...newInvitationForm, email: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <select
                    value={newInvitationForm.type}
                    onChange={(e) => setNewInvitationForm({ ...newInvitationForm, type: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="scout">Scout</option>
                    <option value="leader">Leader</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>
                <button
                  onClick={handleCreateInvitation}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: 'rgba(0, 214, 143, 0.2)',
                    border: '1px solid rgba(0, 214, 143, 0.3)',
                    color: '#00d68f',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={18} style={{ display: 'inline', marginRight: 6 }} />
                  Send Invitation
                </button>
              </div>

              {/* Invitations List */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '1.1rem' }}>
                  Sent Invitations ({invitations.length})
                </h3>
                {invitations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                    No invitations sent yet.
                  </div>
                ) : (
                  invitations.map(invite => (
                    <motion.div
                      key={invite.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', color: '#fff' }}>{invite.name}</h4>
                          <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                            {invite.email} • {invite.type.charAt(0).toUpperCase() + invite.type.slice(1)}
                          </p>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#6496c8', padding: '8px 12px', background: 'rgba(100, 150, 200, 0.1)', borderRadius: 4, display: 'inline-block' }}>
                            Password: <strong>{invite.tempPassword}</strong>
                            <button
                              onClick={() => handleCopyPassword(invite.tempPassword)}
                              style={{
                                marginLeft: 8,
                                padding: '2px 8px',
                                background: 'rgba(100, 150, 200, 0.2)',
                                border: '1px solid rgba(100, 150, 200, 0.3)',
                                color: '#6496c8',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: '4px 12px',
                            background: 'rgba(82, 183, 136, 0.2)',
                            color: '#52b788',
                            borderRadius: 6,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {invite.status}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
