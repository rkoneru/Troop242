import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { scrollToTop } from '../utils/scrollToTop';
import { collection, getDocs, query, orderBy, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { saveData, loadData } from '../utils/adminData';
import { RANKS } from '../data/rankRequirements';
import { BADGE_CATEGORIES } from './Badges';
import '../styles/ScoutDashboardNew.css';


export default function ScoutDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [rankChecks, setRankChecks] = useState({});
  const [meritProgressData, setMeritProgressData] = useState({});
  const [trackedSkillsData, setTrackedSkillsData] = useState({});
  const [miscAwardsData, setMiscAwardsData] = useState({});

  // Load progress data from Firestore with real-time updates
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'progress', user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setRankChecks(data.rankChecks || {});
          setMeritProgressData(data.meritProgress || {});
          setTrackedSkillsData(data.trackedSkills || {});
          setMiscAwardsData(data.miscAwards || {});
        }
      },
      (error) => {
        console.error('Error loading progress:', error);
      }
    );

    return () => unsubscribe();
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
    RANKS.forEach((rank, rankIdx) => {
      const reqCount = rank.requirements.length;
      totalReqs += reqCount;
      for (let j = 0; j < reqCount; j++) {
        if (rankChecks[`${rankIdx}-${j}`]) completedReqs++;
      }
    });
    return { completed: completedReqs, total: totalReqs, percentage: Math.round((completedReqs / totalReqs) * 100) };
  };

  const getMeritProgress = () => {
    const completed = Object.values(meritProgressData).filter((v) => v === 'completed').length;
    const working = Object.values(meritProgressData).filter((v) => v === 'working').length;

    // Count Eagle Required badges
    const eagleRequiredCat = BADGE_CATEGORIES.find(cat => cat.category === 'Eagle Required');
    const eagleRequiredBadges = eagleRequiredCat ? eagleRequiredCat.badges.filter(badge => !badge.isHeader) : [];
    const eagleRequiredCompleted = eagleRequiredBadges.filter(badge => meritProgressData[badge.name] === 'completed').length;

    // Count unique badge names (to avoid duplicates across categories)
    const uniqueBadgeNames = new Set();
    BADGE_CATEGORIES.forEach((cat) => {
      cat.badges.forEach((badge) => {
        if (!badge.isHeader) {
          uniqueBadgeNames.add(badge.name);
        }
      });
    });
    const totalBadges = uniqueBadgeNames.size;

    return { completed, working, total: totalBadges, eagleRequired: eagleRequiredCompleted };
  };

  const getSkillsProgress = () => {
    const TOTAL_SKILLS = 80;
    const tracked = Object.values(trackedSkillsData).filter(Boolean).length;
    return { tracked, total: TOTAL_SKILLS, percentage: Math.round((tracked / TOTAL_SKILLS) * 100) };
  };

  const getActivityProgress = () => {
    const total = Math.max(activities.length, 1);
    return { signedUp: mySignupCount, total };
  };

  const getMiscAwardsCount = () => Object.values(miscAwardsData).filter(Boolean).length;

  const getMiscAwardsProgress = () => {
    const tracked = Object.values(miscAwardsData).filter(Boolean).length;
    const total = 89; // Total awards across all 15 categories
    return { tracked, total, percentage: total > 0 ? Math.round((tracked / total) * 100) : 0 };
  };

  const rankProgress = getRankProgress();
  const meritProgress = getMeritProgress();
  const skillsProgress = getSkillsProgress();
  const activityProgress = getActivityProgress();
  const miscAwardsProgress = getMiscAwardsProgress();

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
    <div className="scout-dash-new">
      {/* TOP BAR */}
      <div className="scout-dash-topbar">
        <h1>Scout Dashboard</h1>
        <div className="scout-dash-topbar-buttons">
          <motion.button
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = '/Troop242/Games/scout-portal.html';
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            📖 Scout Portal
          </motion.button>
          <motion.button
            className="btn btn-outline"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <LogOut size={18} />
            Log Out
          </motion.button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="scout-dash-main">
        {/* LEFT SIDEBAR */}
        <div className="scout-dash-sidebar">
          <div className="scout-dash-sidebar-icons">
            <motion.button
              className="scout-dash-icon-btn active"
              onClick={() => { navigate('/scout-dashboard'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Dashboard"
            >
              📊
            </motion.button>
            <motion.button
              className="scout-dash-icon-btn"
              onClick={() => { navigate('/rank-tracker'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Rank Tracker"
            >
              ⚜️
            </motion.button>
            <motion.button
              className="scout-dash-icon-btn"
              onClick={() => { navigate('/merit-tracker'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Merit Badges"
            >
              🎖️
            </motion.button>
            <motion.button
              className="scout-dash-icon-btn"
              onClick={() => { navigate('/activities'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Activities"
            >
              📅
            </motion.button>
            <motion.button
              className="scout-dash-icon-btn"
              onClick={() => { navigate('/skills-tracker'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Skills"
            >
              ⚡
            </motion.button>
          </div>
          <div className="scout-dash-sidebar-profile" title={profile?.name || 'Scout'}>
            👤
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="scout-dash-content">
          {/* HERO SECTION */}
          <motion.div
            className="scout-dash-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* LEFT: Rank Hero */}
            <div className="scout-dash-hero-left">
              <div className="scout-dash-hero-title">
                <h2>Welcome back, {profile?.name || 'Scout'}</h2>
                <p>Working towards {currentRank.emoji} {currentRank.name}</p>
              </div>

              <div className="scout-dash-rank-graphic">
                <div className="scout-dash-rank-glow" />
                <div className="scout-dash-rank-emoji">{currentRank.emoji}</div>
                <div className="scout-dash-rank-info">
                  <h3>{currentRank.name}</h3>
                  <p>Rank {currentRankIdx + 1} of 7</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Right Panels */}
            <div className="scout-dash-right-panels">
              {/* Skills Panel */}
              <motion.div
                className="scout-dash-panel"
                whileHover={{ y: -2 }}
                onClick={() => { navigate('/skills-tracker'); scrollToTop(); }}
                style={{ cursor: 'pointer' }}
              >
                <h4>Skills Tracked</h4>
                <div className="scout-dash-panel-value">{skillsProgress.percentage}%</div>
                <div className="scout-dash-panel-bar">
                  <div
                    className="scout-dash-panel-fill"
                    style={{ width: `${skillsProgress.percentage}%` }}
                  />
                </div>
                <div className="scout-dash-panel-text">
                  {skillsProgress.tracked}/{skillsProgress.total} tracked
                </div>
              </motion.div>

              {/* Activities Panel (Radial) */}
              <motion.div
                className="scout-dash-panel"
                whileHover={{ y: -2 }}
                onClick={() => { navigate('/activities'); scrollToTop(); }}
                style={{ cursor: 'pointer' }}
              >
                <h4>Activities</h4>
                <div className="scout-dash-radial-wrapper">
                  <div
                    className="scout-dash-radial-circle"
                    style={{
                      '--progress-angle': `${(activityProgress.signedUp / (activityProgress.total || 1)) * 360}deg`,
                    }}
                  >
                    <div className="scout-dash-radial-inner">
                      <div className="scout-dash-radial-percent">
                        {Math.round((activityProgress.signedUp / (activityProgress.total || 1)) * 100)}%
                      </div>
                      <div className="scout-dash-radial-label">Complete</div>
                    </div>
                  </div>
                </div>
                <div className="scout-dash-radial-text">
                  {activityProgress.signedUp} of {activityProgress.total} signed up
                </div>
              </motion.div>

              {/* Misc Awards Panel */}
              <motion.div
                className="scout-dash-panel"
                whileHover={{ y: -2 }}
                onClick={() => { navigate('/misc-awards'); scrollToTop(); }}
                style={{ cursor: 'pointer' }}
              >
                <h4>Awards</h4>
                <div className="scout-dash-panel-value">{miscAwardsProgress.percentage}%</div>
                <div className="scout-dash-panel-bar">
                  <div
                    className="scout-dash-panel-fill"
                    style={{ width: `${miscAwardsProgress.percentage}%` }}
                  />
                </div>
                <div className="scout-dash-panel-text">
                  {miscAwardsProgress.tracked}/{miscAwardsProgress.total} earned
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CARDS ROW */}
          <motion.div
            className="scout-dash-cards-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* RANK PROGRESS CARD */}
            <motion.div
              className="scout-dash-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate('/rank-tracker'); scrollToTop(); }}
              style={{ cursor: 'pointer' }}
            >
              <div className="scout-dash-card-header">
                <div className="scout-dash-card-icon">⚜️</div>
                <h3>Rank Progress</h3>
              </div>
              <div className="scout-dash-progress-large">
                <div className="scout-dash-progress-value">{rankProgress.percentage}%</div>
                <div className="scout-dash-progress-bar">
                  <div
                    className="scout-dash-progress-fill"
                    style={{ width: `${rankProgress.percentage}%` }}
                  />
                </div>
                <div className="scout-dash-progress-detail">
                  {rankProgress.completed}/{rankProgress.total} requirements
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/rank-tracker');
                  scrollToTop();
                }}
                style={{ width: '100%' }}
              >
                Track Rank
              </button>
            </motion.div>

            {/* MERIT BADGES CARD */}
            <motion.div
              className="scout-dash-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate('/merit-tracker'); scrollToTop(); }}
              style={{ cursor: 'pointer' }}
            >
              <div className="scout-dash-card-header">
                <div className="scout-dash-card-icon">🎖️</div>
                <h3>Merit Badges</h3>
              </div>
              <div className="scout-dash-progress-large">
                <div className="scout-dash-progress-value">
                  {meritProgress.completed}
                  <span style={{ fontSize: '1.2rem', marginLeft: 8 }}>🦅</span>
                </div>
                <div className="scout-dash-progress-bar">
                  <div
                    className="scout-dash-progress-fill"
                    style={{
                      width: `${meritProgress.total > 0 ? (meritProgress.completed / meritProgress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="scout-dash-progress-detail">
                  {meritProgress.eagleRequired} 🦅 required • {meritProgress.completed - meritProgress.eagleRequired} completed • {meritProgress.working} in progress
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/merit-tracker');
                  scrollToTop();
                }}
                style={{ width: '100%' }}
              >
                Browse Badges
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
