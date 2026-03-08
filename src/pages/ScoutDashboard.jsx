import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Badge, LogOut, ChevronRight, Zap, Users } from 'lucide-react';

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
  const [user, setUser] = useState(null);

  // Auth guard
  useEffect(() => {
    const stored = sessionStorage.getItem('loggedInUser');
    if (!stored) {
      navigate('/member-login');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.profile !== 'scout') {
        navigate('/member-login');
        return;
      }
      setUser(parsed);
    } catch {
      navigate('/member-login');
    }
  }, [navigate]);

  // Read progress data
  const rankChecks = (() => {
    try {
      return JSON.parse(localStorage.getItem('rankChecks') || '{}');
    } catch {
      return {};
    }
  })();

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

  const signedUpActivities = (() => {
    try {
      return JSON.parse(localStorage.getItem('scoutSignups') || '[]');
    } catch {
      return [];
    }
  })();

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
    const total = badgeWishlist.length > 0 ? badgeWishlist.length : 1;
    return { wishlisted: badgeWishlist.length, percentage: badgeWishlist.length > 0 ? 100 : 0 };
  };

  const getSkillsProgress = () => {
    const TOTAL_SKILLS = 80;
    const tracked = Object.values(trackedSkills).filter(Boolean).length;
    return { tracked, total: TOTAL_SKILLS, percentage: Math.round((tracked / TOTAL_SKILLS) * 100) };
  };

  const getActivityProgress = () => {
    return { signedUp: signedUpActivities.length, total: ACTIVITIES.length };
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

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    navigate('/member-login');
  };

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
                {user.name || 'Scout'} • Working towards {currentRank.emoji} {currentRank.name}
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
                {meritProgress.wishlisted}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>badges in wishlist</p>
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
              onClick={() => navigate('/rank-tracker')}
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

              <motion.button
                className="btn btn-primary"
                whileHover={{ gap: 16 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Continue <ChevronRight size={18} />
              </motion.button>
            </motion.div>

            {/* MERIT BADGE TRACKER TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/badges')}
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
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Wishlist</span>
                  <span style={{ fontWeight: 600 }}>{meritProgress.wishlisted} badges</span>
                </div>
                {meritProgress.wishlisted > 0 && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    <div style={{ maxHeight: '60px', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {badgeWishlist.slice(0, 5).map((badge, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'rgba(var(--accent-rgb), 0.1)',
                            color: 'var(--accent)',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                      {meritProgress.wishlisted > 5 && (
                        <span
                          style={{
                            background: 'rgba(var(--accent-rgb), 0.1)',
                            color: 'var(--accent)',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                          }}
                        >
                          +{meritProgress.wishlisted - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                className="btn btn-primary"
                whileHover={{ gap: 16 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Browse Badges <ChevronRight size={18} />
              </motion.button>
            </motion.div>

            {/* ACTIVITY SIGNUP TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/scout-signup')}
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

              <motion.button
                className="btn btn-primary"
                whileHover={{ gap: 16 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                View Events <ChevronRight size={18} />
              </motion.button>
            </motion.div>

            {/* SKILLS TRACKER TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/skills')}
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

              <motion.button
                className="btn btn-primary"
                whileHover={{ gap: 16 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Track Skills <ChevronRight size={18} />
              </motion.button>
            </motion.div>

            {/* FUNDRAISING TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/calendar')}
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

              <motion.button
                className="btn btn-primary"
                whileHover={{ gap: 16 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                View Events <ChevronRight size={18} />
              </motion.button>
            </motion.div>

            {/* ADVANCEMENT GUIDE TILE */}
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 32, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/ranks')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>📖</div>
                <div>
                  <h3 style={{ marginBottom: 4, marginTop: 0 }}>Advancement Guide</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Learn about ranks & paths
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>
                  Explore the scout rank structure, requirements, and timeline to Eagle Scout.
                </p>
              </div>

              <motion.button
                className="btn btn-primary"
                whileHover={{ gap: 16 }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                Explore Guide <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
