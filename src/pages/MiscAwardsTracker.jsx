import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { MISC_AWARD_CATEGORIES } from '../data/miscAwards';
import ScoutDashboardMobileSidebar from '../components/ScoutDashboardMobileSidebar';
import '../styles/misc-awards-tracker.css';

export default function MiscAwardsTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // State
  const [miscAwards, setMiscAwards] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Load progress from Firestore with localStorage fallback (migration)
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const snap = await getDoc(doc(db, 'progress', user.uid));
        const data = snap.data() || {};

        if (data.miscAwards) {
          // Firestore data exists, use it
          setMiscAwards(data.miscAwards);
        } else {
          // No Firestore data, check localStorage for migration
          const localAwards = (() => {
            try {
              return JSON.parse(localStorage.getItem('miscAwards') || '{}');
            } catch {
              return {};
            }
          })();

          if (Object.keys(localAwards).length > 0) {
            // Migrate from localStorage to Firestore
            setMiscAwards(localAwards);
            await setDoc(
              doc(db, 'progress', user.uid),
              { miscAwards: localAwards },
              { merge: true }
            );
            localStorage.removeItem('miscAwards');
          }
        }
      } catch (error) {
        console.error('Error loading misc awards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  // Handlers
  const toggleAward = async (awardName) => {
    const updated = { ...miscAwards };
    updated[awardName] = !updated[awardName];
    if (!updated[awardName]) delete updated[awardName]; // clean up falsy
    setMiscAwards(updated);

    // Save to Firestore
    if (user) {
      try {
        await setDoc(
          doc(db, 'progress', user.uid),
          { miscAwards: updated },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving misc awards:', error);
      }
    }
  };

  const toggleCategory = (catIdx) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catIdx]: !prev[catIdx],
    }));
  };

  // Compute progress
  const getCompletedCountForCategory = (catIdx) => {
    return MISC_AWARD_CATEGORIES[catIdx].awards.filter(
      (award) => miscAwards[award]
    ).length;
  };

  const getTotalForCategory = (catIdx) => {
    return MISC_AWARD_CATEGORIES[catIdx].awards.length;
  };

  const getTotalEarned = () => {
    return Object.values(miscAwards).filter(Boolean).length;
  };

  const getTotalAwards = () => {
    return MISC_AWARD_CATEGORIES.reduce((sum, cat) => sum + cat.awards.length, 0);
  };

  // Render state
  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="misc-awards-tracker">
      {/* Header */}
      <div className="misc-awards-header">
        <motion.button
          className="btn btn-outline"
          onClick={() => navigate('/scout-dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
        <h1 className="misc-awards-title">Misc Awards Tracker</h1>
        <div style={{ width: 120 }} />
      </div>

      <div className="misc-awards-container">
        {/* Summary Card */}
        <motion.div
          className="misc-awards-summary"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="misc-awards-stat">
            <p className="misc-awards-stat-label">Total Earned</p>
            <p className="misc-awards-stat-value">{getTotalEarned()}</p>
            <p className="misc-awards-stat-detail">of {getTotalAwards()} awards</p>
          </div>
          <div className="misc-awards-stat">
            <p className="misc-awards-stat-label">Progress</p>
            <p className="misc-awards-stat-value">
              {Math.round((getTotalEarned() / getTotalAwards()) * 100)}%
            </p>
            <p className="misc-awards-stat-detail">completion rate</p>
          </div>
          <div className="misc-awards-stat">
            <p className="misc-awards-stat-label">Categories</p>
            <p className="misc-awards-stat-value">{MISC_AWARD_CATEGORIES.length}</p>
            <p className="misc-awards-stat-detail">total categories</p>
          </div>
        </motion.div>

        {/* Collapsible Categories */}
        <div className="misc-awards-categories">
          {MISC_AWARD_CATEGORIES.map((cat, catIdx) => {
            const isExpanded = expandedCategories[catIdx];
            const completedCount = getCompletedCountForCategory(catIdx);
            const totalCount = getTotalForCategory(catIdx);

            return (
              <div key={catIdx} className="misc-awards-category-section">
                {/* Category Header */}
                <motion.button
                  className="misc-awards-category-header"
                  onClick={() => toggleCategory(catIdx)}
                  whileHover={{ backgroundColor: 'rgba(0, 214, 143, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="misc-awards-category-info">
                    <span className="misc-awards-category-emoji">{cat.emoji}</span>
                    <div className="misc-awards-category-text">
                      <div className="misc-awards-category-name">{cat.category}</div>
                      <div className="misc-awards-category-progress">
                        {completedCount}/{totalCount} earned
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="misc-awards-chevron"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </motion.button>

                {/* Awards List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="misc-awards-category-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="misc-awards-awards-list">
                        {cat.awards.map((award, awardIdx) => {
                          const isEarned = miscAwards[award];
                          return (
                            <motion.div
                              key={awardIdx}
                              className={`misc-awards-award-item ${isEarned ? 'earned' : ''}`}
                              onClick={() => toggleAward(award)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`misc-awards-award-checkbox ${isEarned ? 'checked' : ''}`}>
                                {isEarned && <Check size={16} color="white" />}
                              </div>
                              <span className="misc-awards-award-name">
                                {award}
                              </span>
                              {isEarned && (
                                <span className="misc-awards-award-badge">Earned</span>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION - Hide awards icon since we're on awards page */}
      <ScoutDashboardMobileSidebar hideActive={true} />
    </div>
  );
}
