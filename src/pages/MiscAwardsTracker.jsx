import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { MISC_AWARD_CATEGORIES } from '../data/miscAwards';

export default function MiscAwardsTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // State
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [miscAwards, setMiscAwards] = useState({});

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

  // Memoize static total awards count across all categories
  const totalAwards = useMemo(() => {
    return MISC_AWARD_CATEGORIES.reduce((sum, cat) => sum + cat.awards.length, 0);
  }, []);

  // Memoize total earned awards count from user state
  const totalEarned = useMemo(() => {
    return Object.values(miscAwards).filter(Boolean).length;
  }, [miscAwards]);

  // Memoize per-category completed and total counts to eliminate O(C * A) filtering on every render
  const categoryCounts = useMemo(() => {
    return MISC_AWARD_CATEGORIES.map((cat) => ({
      completed: cat.awards.filter((award) => miscAwards[award]).length,
      total: cat.awards.length,
    }));
  }, [miscAwards]);

  // Render state
  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  const currentCategory = MISC_AWARD_CATEGORIES[selectedCategoryIdx];
  const completedCount = categoryCounts[selectedCategoryIdx]?.completed || 0;
  const totalCount = categoryCounts[selectedCategoryIdx]?.total || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'var(--bg-secondary)', borderBottom: `1px solid var(--divider)`, zIndex: 100, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.button
            className="btn btn-outline"
            onClick={() => navigate('/scout-dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ArrowLeft size={18} /> Back
          </motion.button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Misc Awards Tracker</h1>
          <div style={{ width: 120 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-secondary)',
            border: `1px solid var(--divider)`,
            borderRadius: 12,
            padding: '24px',
            marginBottom: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 24,
          }}
        >
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Total Earned</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 4px 0' }}>{totalEarned}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>of {totalAwards} awards</p>
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Progress</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 4px 0' }}>
              {totalAwards > 0 ? Math.round((totalEarned / totalAwards) * 100) : 0}%
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>completion rate</p>
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Categories</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 4px 0' }}>{MISC_AWARD_CATEGORIES.length}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>total categories</p>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        {/* Sidebar: Categories */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 4 }}>Category Progress</p>
          </div>

          <div style={{ border: `1px solid var(--divider)`, borderRadius: 12, overflow: 'hidden' }}>
            {MISC_AWARD_CATEGORIES.map((cat, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedCategoryIdx(idx)}
                whileHover={{ backgroundColor: 'rgba(var(--accent-rgb, 0, 214, 143), 0.1)' }}
                style={{
                  width: '100%',
                  padding: '16px',
                  textAlign: 'left',
                  border: 'none',
                  borderBottom: idx < MISC_AWARD_CATEGORIES.length - 1 ? `1px solid var(--divider)` : 'none',
                  background: selectedCategoryIdx === idx ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: selectedCategoryIdx === idx ? 'white' : 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cat.category}</div>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: selectedCategoryIdx === idx ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  {categoryCounts[idx]?.completed || 0}/{categoryCounts[idx]?.total || 0}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main: Awards List */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ fontSize: '2.5rem' }}>{currentCategory.emoji}</div>
              <div>
                <h2 style={{ marginBottom: 4, marginTop: 0, fontSize: '1.5rem', fontWeight: 600 }}>{currentCategory.category}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  {completedCount} of {totalCount} earned in this category
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentCategory.awards.map((award, awardIdx) => {
                const isEarned = miscAwards[award];
                return (
                  <motion.div
                    key={awardIdx}
                    onClick={() => toggleAward(award)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '16px',
                      border: isEarned ? '1px solid #10b981' : '1px solid var(--divider)',
                      borderRadius: 8,
                      background: isEarned ? 'rgba(16,185,129,0.05)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: isEarned ? '2px solid #10b981' : '2px solid var(--divider)',
                        background: isEarned ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isEarned && <Check size={16} color="white" />}
                    </div>

                    {/* Award Name */}
                    <span
                      style={{
                        flex: 1,
                        textDecoration: isEarned ? 'line-through' : 'none',
                        color: isEarned ? 'var(--text-muted)' : 'var(--text-main)',
                      }}
                    >
                      {award}
                    </span>

                    {/* Badge */}
                    {isEarned && (
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Earned</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
