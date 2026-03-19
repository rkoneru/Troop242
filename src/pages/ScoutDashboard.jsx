import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Badge, LogOut, ChevronRight, Zap, Users, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { scrollToTop } from '../utils/scrollToTop';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { saveData, loadData } from '../utils/adminData';

const RANKS = [
  { name: 'Scout', emoji: '⚜️' },
  { name: 'Tenderfoot', emoji: '🎖️' },
  { name: '2nd Class', emoji: '🗝️' },
  { name: '1st Class', emoji: '🛡️' },
  { name: 'Star', emoji: '⭐' },
  { name: 'Life', emoji: '✨' },
  { name: 'Eagle', emoji: '🦅' },
];

const ACTIVITIES = [
  { id: 1, name: 'Camping Trip', icon: '⛺' },
  { id: 2, name: 'Car Wash', icon: '🚗' },
  { id: 3, name: 'Shop & Sell', icon: '🪵' },
  { id: 4, name: 'Community Service', icon: '🌳' },
  { id: 5, name: 'Hiking Expedition', icon: '🥾' },
  { id: 6, name: 'Skill Workshop', icon: '🔧' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ScoutDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [rankChecks, setRankChecks] = useState({});

  // Load progress data from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      try {
        const snap = await getDoc(doc(db, 'progress', user.uid));
        if (snap.exists()) {
          setRankChecks(snap.data().rankChecks || {});
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, [user]);

  // Load activities from Firestore
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
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    loadActivities();
  }, [loading]);

  // Show pending approval message if scout hasn't been approved
  if (!loading && profile?.status === 'pending') {
    return (
      <section className="scout-dashboard" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳ Awaiting Approval</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Your scout profile is pending approval by a troop leader.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Once approved, you'll have full access to the scout dashboard and can start tracking your advancement.
          </p>
        </div>
      </section>
    );
  }

  const trackedSkills = (() => {
    try {
      return JSON.parse(localStorage.getItem('trackedSkills') || '{}');
    } catch {
      return {};
    }
  })();

  const badgeWishlist = (() => {
    try {
      return JSON.parse(localStorage.getItem('badgeWishlist') || '[]');
    } catch {
      return [];
    }
  })();

  // Activity helpers
  const isSignedUp = (activity) =>
    activity.signedUp?.some(s => s.uid === user?.uid) || false;

  const isFull = (activity) => false; // No spot limit for Firestore activities

  const handleSignup = (activityId) => {
    // Signup functionality moved to /scout-signup page with Firestore
    navigate('/scout-signup');
  };

  const mySignupCount = activities.filter(act => isSignedUp(act)).length;

  // Compute progress percentages
  const getRankProgress = () => {
    let totalReqs = 0;
    let completedReqs = 0;
    RANKS.forEach((_, rankIdx) => {
      const reqCount = [3, 4, 4, 4, 4, 4, 4][rankIdx];
      totalReqs += reqCount;
      for (let j = 0; j < reqCount; j++) {
        if (rankChecks[`${rankIdx}-${j}`]) completedReqs++;
      }
    });
    return { completed: completedReqs, total: totalReqs, percentage: Math.round((completedReqs / totalReqs) * 100) };
  };

  const getMeritProgress = () => {
    const meritProgress = (() => {
      try {
        return JSON.parse(localStorage.getItem('meritProgress') || '{}');
      } catch {
        return {};
      }
    })();
    const completed = Object.values(meritProgress).filter((v) => v === 'completed').length;
    const working = Object.values(meritProgress).filter((v) => v === 'working').length;
    return { completed, working, total: completed + working };
  };

  const getSkillsProgress = () => {
    const TOTAL_SKILLS = 80;
    const tracked = Object.values(trackedSkills).filter(Boolean).length;
    return { tracked, total: TOTAL_SKILLS, percentage: Math.round((tracked / TOTAL_SKILLS) * 100) };
  };

  const getActivityProgress = () => {
    const total = Math.max(activities.length, 1);
    return { signedUp: mySignupCount, total };
  };

  const rankProgress = getRankProgress();
  const meritProgress = getMeritProgress();
  const skillsProgress = getSkillsProgress();
  const activityProgress = getActivityProgress();

  // Find current rank (first incomplete)
  let currentRankIdx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    const reqCount = [3, 4, 4, 4, 4, 4, 4][i];
    let completed = 0;
    for (let j = 0; j < reqCount; j++) {
      if (rankChecks[`${i}-${j}`]) completed++;
    }
    if (completed < reqCount) {
      currentRankIdx = i;
      break;
    }
  }
  const currentRank = RANKS[currentRankIdx];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/member-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || isLoadingActivities) {
    return (
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading dashboard...</p>
        </div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))',
          padding: '40px 20px',
          borderBottom: '1px solid var(--divider)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: 8, marginTop: 0 }}>Welcome back</p>
              <h1 style={{ marginBottom: 8, marginTop: 0 }}>Scout Dashboard</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 0 }}>
                {profile?.name || 'Scout'} • Working towards {currentRank.emoji} {currentRank.name}
              </p>
            </motion.div>
            <motion.button
              className="btn btn-outline"
              onClick={handleLogout}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
            >
              <LogOut size={18} />
              Log Out
            </motion.button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '40px 20px' }}>
        <div className="container">
          {/* Quick Stats Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 40,
            }}
          >
            {/* Rank Progress Stat */}
            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Award size={24} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 600 }}>Rank Progress</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                {rankProgress.percentage}%
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                {rankProgress.completed}/{rankProgress.total} requirements
              </p>
            </motion.div>

            {/* Skills Stat */}
            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Zap size={24} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 600 }}>Skills</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                {skillsProgress.percentage}%
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                {skillsProgress.tracked}/{skillsProgress.total} tracked
              </p>
            </motion.div>

            {/* Merit Badges Stat */}
            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Badge size={24} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 600 }}>Merit Badges</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                {meritProgress.total}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>badges tracked</p>
            </motion.div>

            {/* Activities Stat */}
            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Users size={24} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 600 }}>Activities</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                {activityProgress.signedUp}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                of {activityProgress.total} signed up
              </p>
            </motion.div>
          </motion.div>

          {/* Main Tracking Tiles */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
              marginBottom: 40,
            }}
          >
            {/* RANK TRACKER TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate('/rank-tracker'); scrollToTop(); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>⚜️</div>
                <div>
                  <h3 style={{ marginBottom: 4, marginTop: 0 }}>Rank Tracker</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Track your advancement
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Currently: {currentRank.emoji} {currentRank.name}
                </p>
                <div style={{ background: 'var(--divider)', borderRadius: 99, height: 8 }}>
                  <div
                    style={{
                      width: `${rankProgress.percentage}%`,
                      background: 'var(--accent)',
                      height: '100%',
                      borderRadius: 99,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                  {rankProgress.percentage}% complete
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/rank-tracker');
                  scrollToTop();
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Continue <ChevronRight size={18} />
              </button>
            </motion.div>

            {/* MERIT BADGE TRACKER TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/merit-tracker')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>🎖️</div>
                <div>
                  <h3 style={{ marginBottom: 4, marginTop: 0 }}>Merit Badges</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Explore & earn badges
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Progress</span>
                  <span style={{ fontWeight: 600 }}>{meritProgress.completed} completed</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {meritProgress.working > 0 && <span>{meritProgress.working} in progress</span>}
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/merit-tracker');
                  scrollToTop();
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Browse Badges <ChevronRight size={18} />
              </button>
            </motion.div>

            {/* SKILLS TRACKER TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/skills-tracker')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>⚡</div>
                <div>
                  <h3 style={{ marginBottom: 4, marginTop: 0 }}>Essential Skills</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Master scout skills
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>Skills Tracked</p>
                <div style={{ background: 'var(--divider)', borderRadius: 99, height: 8 }}>
                  <div
                    style={{
                      width: `${skillsProgress.percentage}%`,
                      background: 'var(--accent)',
                      height: '100%',
                      borderRadius: 99,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                  {skillsProgress.tracked}/{skillsProgress.total} skills
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/skills-tracker');
                  scrollToTop();
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Track Skills <ChevronRight size={18} />
              </button>
            </motion.div>

            {/* ACTIVITY SIGNUP TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/activities')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>📅</div>
                <div>
                  <h3 style={{ marginBottom: 4, marginTop: 0 }}>Activities & Events</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Sign up for troop events
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Signed Up</span>
                  <span style={{ fontWeight: 600 }}>
                    {activityProgress.signedUp}/{activityProgress.total}
                  </span>
                </div>
                <div style={{ background: 'var(--divider)', borderRadius: 99, height: 8 }}>
                  <div
                    style={{
                      width: `${(activityProgress.signedUp / activityProgress.total) * 100}%`,
                      background: 'var(--accent)',
                      height: '100%',
                      borderRadius: 99,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/activities');
                  scrollToTop();
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                View Events <ChevronRight size={18} />
              </button>
            </motion.div>



            {/* FUNDRAISING TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate('/calendar'); scrollToTop(); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>💰</div>
                <div>
                  <h3 style={{ marginBottom: 4, marginTop: 0 }}>Fundraising</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Troop fundraising events
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>
                  Help raise funds for troop activities and equipment. Every scout pitches in!
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/calendar');
                  scrollToTop();
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                View Events <ChevronRight size={18} />
              </button>
            </motion.div>

            {/* SCOUT PORTAL TILE */}
             <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { window.location.href = '/Troop242/Games/scout-portal.html'; }}
              // onClick={() => { navigate('/scout-portal'); scrollToTop(); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>📖</div>
                <div>
                  <h3 style={{ marginBottom: 4, marginTop: 0 }}>Scout Portal</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Interactive scout tools & games
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>
                  Access attendance tracking, knot guides, packing lists, and interactive games.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = '/Troop242/Games/scout-portal.html';
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Access Portal <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        </div>

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
      </section>
    </>
  );
}
