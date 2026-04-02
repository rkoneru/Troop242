import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { scrollToTop } from '../utils/scrollToTop';
import { collection, getDocs, query, orderBy, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { saveData, loadData } from '../utils/adminData';
import { RANKS } from '../data/rankRequirements';
import { BADGE_CATEGORIES } from './Badges';
import ScoutDashboardMobileSidebar from '../components/ScoutDashboardMobileSidebar';
//import SearchWidget from '../components/SearchWidget';
import '../styles/ScoutDashboardNew.css';
import { RANK_MAPPING } from '../data/rankMapping';


export default function ScoutDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [rankChecks, setRankChecks] = useState({});
  const [meritProgressData, setMeritProgressData] = useState({});
  const [trackedSkillsData, setTrackedSkillsData] = useState({});
  const [miscAwardsData, setMiscAwardsData] = useState({});
  const [showSearch, setShowSearch] = useState(false);

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

  // Load activities from Firestore (with caching)
  useEffect(() => {
    if (loading || !user) return;

    // Check if activities are already cached
    const cachedActivities = localStorage.getItem('cachedActivities');
    const cacheTime = localStorage.getItem('cachedActivitiesTime');
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    if (cachedActivities && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
      try {
        setActivities(JSON.parse(cachedActivities));
        setIsLoadingActivities(false);
        return;
      } catch (e) {
        console.warn('Cache parse error:', e);
      }
    }

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
        // Cache the results
        localStorage.setItem('cachedActivities', JSON.stringify(loaded));
        localStorage.setItem('cachedActivitiesTime', now.toString());
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    loadActivities();
  }, [loading, user]);

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
  const previousRank = RANKS[Math.max(currentRankIdx - 1, 0)];

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
        <h2>Scout Dashboard</h2>
      </div>

      {/* MAIN LAYOUT */}
      <div className="scout-dash-main">
        {/* LEFT SIDEBAR - TWO COLUMN */}
        <div className="scout-dash-sidebar">
          {/* PILL STRIP (LEFT) */}
          <div className="scout-dash-pill-strip">
            <motion.button
              className="scout-dash-pill-btn active"
              style={{ '--pill-bg': '#FFB347' }}
              onClick={() => { navigate('/scout-dashboard'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Dashboard"
            >
              ⛺
            </motion.button>
            <motion.button
              className="scout-dash-pill-btn"
              style={{ '--pill-bg': '#C3B1E1' }}
              onClick={() => { navigate('/rank-tracker'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Rank Tracker"
            >
              ⚜️
            </motion.button>
            <motion.button
              className="scout-dash-pill-btn"
              style={{ '--pill-bg': '#81C784' }}
              onClick={() => { navigate('/merit-tracker'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Merit Badges"
            >
              🎖️
            </motion.button>
            <motion.button
              className="scout-dash-pill-btn"
              style={{ '--pill-bg': '#FFF176' }}
              onClick={() => { navigate('/skills-tracker'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Skills"
            >
              ⚡
            </motion.button>
            <motion.button
              className="scout-dash-pill-btn"
              style={{ '--pill-bg': '#EF9A9A' }}
              onClick={() => { navigate('/activities'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Activities / Events"
            >
              📅
            </motion.button>
            <motion.button
              className="scout-dash-pill-btn"
              style={{ '--pill-bg': '#90CAF9' }}
              onClick={() => { navigate('/misc-awards'); scrollToTop(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Awards"
            >
              🏆
            </motion.button>
            <motion.button
              className="scout-dash-pill-btn"
              style={{ '--pill-bg': '#A5D6A7' }}
              onClick={() => { window.location.href = '/Troop242/Games/scout-portal.html'; }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Scout Portal"
            >
              🗺️
            </motion.button>
            <motion.button
              className="scout-dash-pill-btn logout"
              style={{ '--pill-bg': '#B0BEC5' }}
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              🔓
            </motion.button>
          </div>

          {/* MENU PANEL (RIGHT) */}
          <div className="scout-dash-menu-panel">
            <div className="scout-dash-menu-label">MENU</div>
            <motion.button
              className="scout-dash-menu-item active"
              onClick={() => { navigate('/scout-dashboard'); scrollToTop(); }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>⛺</span> Dashboard
            </motion.button>
            <motion.button
              className="scout-dash-menu-item"
              onClick={() => { navigate('/rank-tracker'); scrollToTop(); }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>⚜️</span> Rank Tracker
            </motion.button>
            <motion.button
              className="scout-dash-menu-item"
              onClick={() => { navigate('/merit-tracker'); scrollToTop(); }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>🎖️</span> Merit Badges
            </motion.button>
            <motion.button
              className="scout-dash-menu-item"
              onClick={() => { navigate('/skills-tracker'); scrollToTop(); }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>⚡</span> Skills
            </motion.button>
            <motion.button
              className="scout-dash-menu-item"
              onClick={() => { navigate('/activities'); scrollToTop(); }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>📅</span> Activities
            </motion.button>
            <motion.button
              className="scout-dash-menu-item"
              onClick={() => { navigate('/misc-awards'); scrollToTop(); }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>🏆</span> Awards
            </motion.button>
            <motion.button
              className="scout-dash-menu-item"
              onClick={() => { window.location.href = '/Troop242/Games/scout-portal.html'; }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>🗺️</span> Scout Portal
            </motion.button>

            <div className="scout-dash-menu-divider" />

            {/* PROFILE CARD */}
            <motion.div
              className="scout-dash-profile-card"
              whileHover={{ y: -2 }}
              onClick={() => { navigate('/profile'); scrollToTop(); }}
              style={{ cursor: 'pointer' }}
            >
              {previousRank && (
                <>
                  <div className="scout-dash-profile-image">
                    <img
                      src={RANK_MAPPING[Math.max(currentRankIdx - 1, 0)].patchImageUrl}
                      alt={previousRank.name}
                    />
                  </div>
                  <div className="scout-dash-profile-info">
                    <div className="scout-dash-profile-name">{profile?.name || 'Scout'}</div>
                    <div className="scout-dash-profile-rank">{previousRank.name}</div>
                  </div>
                </>
              )}
            </motion.div>

            <motion.button
              className="scout-dash-menu-item logout"
              onClick={handleLogout}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>🔓</span> Logout
            </motion.button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="scout-dash-content" style={{ position: 'relative', marginTop: '0.75rem' }}>
          
          {/* DASHBOARD HEADER */}
          <motion.div
            className="scout-dash-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Scout Dashboard</h2>
            
            <p>Welcome back, {profile?.name || 'Scout'}! </p>
            <p>Rank - {previousRank.emoji} {previousRank.name}</p>
          </motion.div>
            <div className="scout-dash-divider" />
         {/* HERO SECTION */}
          <motion.div
            className="scout-dash-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* LEFT: Rank Hero */}
            <div className="scout-dash-hero-left">
               <div className="scout-dash-rank-graphic">
              <div className="scout-dash-rank-info">
                <h3>{profile?.name || 'Scout'}  currently working on </h3>
              </div>
               
                <div className="scout-dash-rank-glow" />
                {/* <div className="scout-dash-rank-emoji">{currentRank.emoji}</div> */}
                <div className="scout-dash-rank-emoji">
                  <img src={RANK_MAPPING[currentRankIdx].patchImageUrl}  />
                </div>
                <div className="scout-dash-rank-info">
                  <h2>{currentRank.name}</h2>
                  <p>Rank {currentRankIdx + 1} of 7</p>
                </div>
              </div> 
              {/* <p>Way to Go !</p> */}
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
                <h4> ⚡ Skills Tracked</h4>
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
                <h4> 📖 Activities / Events</h4>
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
                <h4> 🏆  Awards</h4>
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
            transition={{ duration: 0.35, delay: 0.1 }}
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
                  {meritProgress.eagleRequired}
                  <span style={{ fontSize: '2.25rem', marginLeft: 8 }}>🦅 + </span>
                  {meritProgress.completed}
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

      {/* SEARCH MODAL OVERLAY */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="scout-search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSearch(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              zIndex: 2000,
              paddingTop: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '90%', maxWidth: '600px' }}
            >
              <SearchWidget />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION - Hide home icon on dashboard */}
      <ScoutDashboardMobileSidebar hideActive={true} />
    </div>
  );
}
