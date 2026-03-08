import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import { SKILL_CATEGORIES } from './Skills';

export default function SkillsTrackerWizard() {
  const navigate = useNavigate();

  // Auth guard
  const user = (() => {
    const stored = sessionStorage.getItem('loggedInUser');
    if (!stored) {
      navigate('/member-login');
      return null;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.profile !== 'scout') {
        navigate('/member-login');
        return null;
      }
      return parsed;
    } catch {
      navigate('/member-login');
      return null;
    }
  })();

  // State
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
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

  const nextSkill = () => {
    const currentCategory = SKILL_CATEGORIES[selectedCategoryIdx];
    if (currentSkillIdx < currentCategory.skills.length - 1) {
      setCurrentSkillIdx(currentSkillIdx + 1);
    }
  };

  const prevSkill = () => {
    if (currentSkillIdx > 0) {
      setCurrentSkillIdx(currentSkillIdx - 1);
    }
  };

  const selectCategory = (catIdx) => {
    setSelectedCategoryIdx(catIdx);
    setCurrentSkillIdx(0);
  };

  // Compute progress per category
  const getCategoryProgress = (catIdx) => {
    const total = SKILL_CATEGORIES[catIdx].skills.length;
    const completed = SKILL_CATEGORIES[catIdx].skills.reduce((count, _, skillIdx) => {
      return trackedSkills[`${catIdx}-${skillIdx}`] ? count + 1 : count;
    }, 0);
    return { completed, total };
  };

  const currentCategory = SKILL_CATEGORIES[selectedCategoryIdx];
  const currentSkill = currentCategory.skills[currentSkillIdx];
  const categoryProgress = getCategoryProgress(selectedCategoryIdx);
  const allComplete = categoryProgress.completed === categoryProgress.total && categoryProgress.total > 0;

  const currentKey = `${selectedCategoryIdx}-${currentSkillIdx}`;
  const isChecked = !!trackedSkills[currentKey];
  const currentNote = skillNotes[currentKey] || '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80, paddingBottom: 100 }}>
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

      {/* Category Selector Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: 16, color: 'var(--text-muted)' }}>SELECT CATEGORY</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, marginBottom: 48 }}>
          {SKILL_CATEGORIES.map((cat, idx) => {
            const prog = getCategoryProgress(idx);
            const isSelected = idx === selectedCategoryIdx;
            return (
              <motion.button
                key={idx}
                className="glass-card"
                onClick={() => selectCategory(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: 12,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid var(--accent)` : '1px solid var(--divider)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{cat.emoji}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: 4, color: isSelected ? 'var(--accent)' : 'var(--text-main)' }}>{cat.category}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prog.completed}/{prog.total}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Breadcrumb & Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            {currentCategory.emoji} {currentCategory.category} • Skill {currentSkillIdx + 1} of {currentCategory.skills.length}
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%',
                background: 'var(--accent)',
                width: `${((currentSkillIdx + 1) / currentCategory.skills.length) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div style={{ maxWidth: 600, margin: '0 auto 48px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategoryIdx}-${currentSkillIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{ padding: 32 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-main)' }}>{currentSkill}</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{currentCategory.category}</p>
              </div>

              {/* Checkbox */}
              <div style={{ marginBottom: 24 }}>
                <motion.button
                  onClick={() => toggleSkill(selectedCategoryIdx, currentSkillIdx)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: `3px solid ${isChecked ? 'var(--accent)' : 'var(--divider)'}`,
                    background: isChecked ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    margin: '0 auto',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isChecked && <Check size={40} style={{ color: 'var(--bg-primary)' }} />}
                </motion.button>
                <p style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {isChecked ? 'Completed' : 'Click to mark complete'}
                </p>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: 8, color: 'var(--text-muted)' }}>
                  Notes (optional)
                </label>
                <textarea
                  value={currentNote}
                  onChange={(e) => saveSkillNote(selectedCategoryIdx, currentSkillIdx, e.target.value)}
                  placeholder="Add notes about what you learned or practiced..."
                  style={{
                    width: '100%',
                    height: 100,
                    padding: 12,
                    border: `1px solid var(--divider)`,
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    borderRadius: 8,
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    resize: 'none',
                  }}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0', textAlign: 'right' }}>Saved</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Category Complete Banner */}
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              maxWidth: 600,
              margin: '0 auto 32px',
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

        {/* Navigation */}
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <motion.button
            className="btn btn-outline"
            onClick={prevSkill}
            disabled={currentSkillIdx === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ opacity: currentSkillIdx === 0 ? 0.5 : 1 }}
          >
            <ChevronLeft size={18} /> Previous
          </motion.button>

          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {currentSkillIdx + 1} of {currentCategory.skills.length}
          </div>

          <motion.button
            className="btn btn-primary"
            onClick={nextSkill}
            disabled={currentSkillIdx === currentCategory.skills.length - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ opacity: currentSkillIdx === currentCategory.skills.length - 1 ? 0.5 : 1 }}
          >
            Next <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
