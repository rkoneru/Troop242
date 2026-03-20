import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { SKILL_CATEGORIES } from './Skills';

export default function SkillsTrackerWizard() {
  const navigate = useNavigate();

  // State
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [trackedSkills, setTrackedSkills] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('trackedSkills') || '{}');
    } catch {
      return {};
    }
  });
  const [skillNotes, setSkillNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillNotes') || '{}');
    } catch {
      return {};
    }
  });
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [categoryViewOpen, setCategoryViewOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handlers
  const toggleSkill = (catIdx, skillIdx) => {
    const key = `${catIdx}-${skillIdx}`;
    const updated = { ...trackedSkills, [key]: !trackedSkills[key] };
    setTrackedSkills(updated);
    localStorage.setItem('trackedSkills', JSON.stringify(updated));
  };

  const saveSkillNote = (catIdx, skillIdx, text) => {
    const key = `${catIdx}-${skillIdx}`;
    const updated = { ...skillNotes, [key]: text };
    setSkillNotes(updated);
    localStorage.setItem('skillNotes', JSON.stringify(updated));
  };

  // Compute progress
  const getCategoryProgress = (catIdx) => {
    const total = SKILL_CATEGORIES[catIdx].skills.length;
    const completed = SKILL_CATEGORIES[catIdx].skills.reduce((count, _, skillIdx) => {
      return trackedSkills[`${catIdx}-${skillIdx}`] ? count + 1 : count;
    }, 0);
    return { completed, total };
  };

  // Search functionality
  const searchAllSkills = () => {
    const results = [];
    SKILL_CATEGORIES.forEach((cat, catIdx) => {
      cat.skills.forEach((skill, skillIdx) => {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        if (skillName.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ name: skillName, categoryIdx: catIdx, skillIdx, categoryName: cat.category });
        }
      });
    });
    return results;
  };

  // Guard against empty SKILL_CATEGORIES
  if (!SKILL_CATEGORIES || SKILL_CATEGORIES.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Skills data is loading...</p>
        </div>
      </div>
    );
  }

  const currentCategory = SKILL_CATEGORIES[selectedCategoryIdx];

  // Safety check for currentCategory
  if (!currentCategory) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Category data is loading...</p>
        </div>
      </div>
    );
  }

  const categoryProgress = getCategoryProgress(selectedCategoryIdx);
  const allComplete = categoryProgress.completed === categoryProgress.total && categoryProgress.total > 0;

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
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Skills Tracker</h1>
          <div style={{ width: 120 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="🔍 Search skills..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: `1px solid var(--divider)`,
                borderRadius: 8,
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '1rem',
              }}
            />
            {searchQuery && (
              <motion.button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--divider)',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <X size={18} /> Clear
              </motion.button>
            )}
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {showSearchResults && searchAllSkills().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: 'var(--bg-secondary)',
                  border: `1px solid var(--divider)`,
                  borderRadius: 8,
                  maxHeight: 400,
                  overflowY: 'auto',
                  zIndex: 50,
                }}
              >
                {searchAllSkills().map((skill, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      toggleSkill(skill.categoryIdx, skill.skillIdx);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    whileHover={{ backgroundColor: 'rgba(var(--accent-rgb, 0, 214, 143), 0.1)' }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      borderBottom: `1px solid var(--divider)`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{skill.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{skill.categoryName}</div>
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: trackedSkills[`${skill.categoryIdx}-${skill.skillIdx}`] ? 'var(--accent)' + '20' : '#9ca3af' + '20',
                        color: trackedSkills[`${skill.categoryIdx}-${skill.skillIdx}`] ? 'var(--accent)' : '#9ca3af',
                        border: `1px solid ${trackedSkills[`${skill.categoryIdx}-${skill.skillIdx}`] ? 'var(--accent)' : '#9ca3af'}`,
                      }}
                    >
                      {trackedSkills[`${skill.categoryIdx}-${skill.skillIdx}`] ? '✓ Done' : 'Not Done'}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
            {showSearchResults && searchAllSkills().length === 0 && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  background: 'var(--bg-secondary)',
                  border: `1px solid var(--divider)`,
                  borderRadius: 8,
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  zIndex: 50,
                }}
              >
                No skills found matching "{searchQuery}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Selector Grid - Hidden on mobile when selected */}
        {(!isMobile || categoryViewOpen) && (
          <>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: 16, color: 'var(--text-muted)' }}>SELECT CATEGORY</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 48 }}>
              {SKILL_CATEGORIES.map((cat, idx) => {
                const prog = getCategoryProgress(idx);
                const isSelected = idx === selectedCategoryIdx;
                return (
                  <motion.button
                    key={idx}
                    className="glass-card"
                    onClick={() => {
                      setSelectedCategoryIdx(idx);
                      if (isMobile) setCategoryViewOpen(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '20px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: isSelected ? `2px solid var(--accent)` : '1px solid var(--divider)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: 140,
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>{cat.emoji}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isSelected ? 'var(--accent)' : 'var(--text-main)', lineHeight: 1.3 }}>{cat.category}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{prog.completed}</div>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {/* Back to Categories Button - Mobile Only */}
        {isMobile && !categoryViewOpen && (
          <motion.button
            className="btn btn-outline"
            onClick={() => setCategoryViewOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginBottom: 24, display: 'block' }}
          >
            ← Back to Categories
          </motion.button>
        )}

        {/* Category Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ fontSize: '2.5rem' }}>{currentCategory.emoji}</div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, marginBottom: 4, color: 'var(--text-main)' }}>
                {currentCategory.category}
              </h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {currentCategory.description}
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{categoryProgress.completed}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed</div>
            </div>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {categoryProgress.total - categoryProgress.completed}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Remaining</div>
            </div>
          </div>
        </div>

        {/* Skills List Table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 0, marginBottom: 20, color: 'var(--text-main)' }}>
            Skills in this Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 8, overflow: 'hidden', border: `1px solid var(--divider)` }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr auto',
                gap: 16,
                padding: '16px',
                background: 'var(--bg-primary)',
                borderBottom: `1px solid var(--divider)`,
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
              }}
            >
              <div>Skill Name</div>
              <div style={{ textAlign: 'center' }}>Status</div>
              <div style={{ textAlign: 'center' }}>Notes</div>
            </div>

            {/* Table Rows */}
            {currentCategory.skills.map((skill, idx) => {
              const key = `${selectedCategoryIdx}-${idx}`;
              const isChecked = !!trackedSkills[key];
              const note = skillNotes[key] || '';
              const isExpanded = expandedSkill === skill;

              return (
                <div key={idx}>
                  {/* Main Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr auto',
                      gap: 16,
                      padding: '16px',
                      background: isExpanded ? 'var(--bg-primary)' : 'transparent',
                      borderBottom: `1px solid var(--divider)`,
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(var(--accent-rgb, 0, 214, 143), 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isExpanded ? 'var(--bg-primary)' : 'transparent';
                    }}
                  >
                    {/* Skill Name */}
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)' }}>
                      {skill}
                    </div>

                    {/* Checkbox */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <motion.button
                        onClick={() => toggleSkill(selectedCategoryIdx, idx)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: `2px solid ${isChecked ? 'var(--accent)' : 'var(--divider)'}`,
                          background: isChecked ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isChecked && <Check size={16} style={{ color: 'var(--bg-primary)' }} />}
                      </motion.button>
                    </div>

                    {/* Notes Indicator */}
                    <div
                      onClick={() => setExpandedSkill(isExpanded ? null : skill)}
                      style={{
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: note ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {note ? '📝' : '○'}
                    </div>
                  </div>

                  {/* Expanded Notes Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          padding: '16px',
                          background: 'var(--bg-primary)',
                          borderBottom: `1px solid var(--divider)`,
                          borderTop: `1px solid var(--divider)`,
                        }}
                      >
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: 8, color: 'var(--text-muted)' }}>
                          Notes for {skill}
                        </label>
                        <textarea
                          value={note}
                          onChange={(e) => saveSkillNote(selectedCategoryIdx, idx, e.target.value)}
                          placeholder="Add what you practiced, techniques learned, or goals..."
                          style={{
                            width: '100%',
                            height: 80,
                            padding: 12,
                            border: `1px solid var(--divider)`,
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-main)',
                            borderRadius: 8,
                            fontFamily: 'inherit',
                            fontSize: '0.9rem',
                            resize: 'none',
                          }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0', textAlign: 'right' }}>Saved</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Complete Banner */}
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              maxWidth: '100%',
              margin: '32px auto 0',
              padding: 20,
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid var(--accent)',
              borderRadius: 8,
              textAlign: 'center',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            🎉 Category Complete! All {categoryProgress.total} skills mastered.
          </motion.div>
        )}
      </div>
    </div>
  );
}
