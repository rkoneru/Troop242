import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
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
  const [categoryViewOpen, setCategoryViewOpen] = useState(true);

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

  const currentCategory = SKILL_CATEGORIES[selectedCategoryIdx];
  const categoryProgress = getCategoryProgress(selectedCategoryIdx);
  const allComplete = categoryProgress.completed === categoryProgress.total && categoryProgress.total > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-10">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--divider)] z-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <motion.button
            className="btn btn-outline"
            onClick={() => navigate('/scout-dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
          <h1 className="text-2xl font-semibold">Skills Tracker</h1>
          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Category Selector Grid - Hidden on mobile when category is selected */}
        {categoryViewOpen && (
          <>
            <h2 className="text-sm font-semibold mb-4 text-[var(--text-muted)] mt-0">SELECT CATEGORY</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
              {SKILL_CATEGORIES.map((cat, idx) => {
                const prog = getCategoryProgress(idx);
                const isSelected = idx === selectedCategoryIdx;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setSelectedCategoryIdx(idx);
                      setCategoryViewOpen(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`glass-card p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-between min-h-[140px] ${
                      isSelected ? 'border-2 border-[var(--accent)]' : 'border border-[var(--divider)]'
                    }`}
                  >
                    <div className="text-2xl">{cat.emoji}</div>
                    <div className={`text-sm font-semibold leading-tight ${
                      isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-main)]'
                    }`}>
                      {cat.category}
                    </div>
                    <div className="text-xl font-bold text-[var(--accent)]">{prog.completed}</div>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {/* Back to Categories Button - Mobile Only */}
        {!categoryViewOpen && (
          <motion.button
            className="btn btn-outline mb-6"
            onClick={() => setCategoryViewOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Categories
          </motion.button>
        )}

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="text-4xl">{currentCategory.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold m-0 mb-1 text-[var(--text-main)]">
                {currentCategory.category}
              </h2>
              <p className="m-0 text-[var(--text-muted)] text-sm">
                {currentCategory.description}
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{categoryProgress.completed}</div>
              <div className="text-xs text-[var(--text-muted)]">Completed</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-[var(--text-muted)]">
                {categoryProgress.total - categoryProgress.completed}
              </div>
              <div className="text-xs text-[var(--text-muted)]">Remaining</div>
            </div>
          </div>
        </div>

        {/* Skills List Table */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mt-0 mb-5 text-[var(--text-main)]">
            Skills in this Category
          </h3>

          <div className="flex flex-col rounded-lg overflow-hidden border border-[var(--divider)]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_auto] gap-4 px-4 py-4 bg-[var(--bg-primary)] border-b border-[var(--divider)] font-semibold text-sm text-[var(--text-muted)]">
              <div>Skill Name</div>
              <div className="text-center">Status</div>
              <div className="text-center">Notes</div>
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
                    className="grid grid-cols-[1.5fr_1fr_auto] gap-4 px-4 py-4 border-b border-[var(--divider)] items-center cursor-pointer transition-all hover:bg-[rgba(0,214,143,0.05)]"
                    style={{
                      background: isExpanded ? 'var(--bg-primary)' : 'transparent',
                    }}
                  >
                    {/* Skill Name */}
                    <div className="text-sm font-medium text-[var(--text-main)]">
                      {skill}
                    </div>

                    {/* Checkbox */}
                    <div className="flex justify-center">
                      <motion.button
                        onClick={() => toggleSkill(selectedCategoryIdx, idx)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        style={{
                          borderColor: isChecked ? 'var(--accent)' : 'var(--divider)',
                          backgroundColor: isChecked ? 'var(--accent)' : 'transparent',
                        }}
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
                      >
                        {isChecked && <Check size={16} style={{ color: 'var(--bg-primary)' }} />}
                      </motion.button>
                    </div>

                    {/* Notes Indicator */}
                    <div
                      onClick={() => setExpandedSkill(isExpanded ? null : skill)}
                      className={`text-center text-sm cursor-pointer ${
                        note ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                      }`}
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
                        className="px-4 py-4 bg-[var(--bg-primary)] border-b border-t border-[var(--divider)]"
                      >
                        <label className="block text-sm font-medium mb-2 text-[var(--text-muted)]">
                          Notes for {skill}
                        </label>
                        <textarea
                          value={note}
                          onChange={(e) => saveSkillNote(selectedCategoryIdx, idx, e.target.value)}
                          placeholder="Add what you practiced, techniques learned, or goals..."
                          className="w-full h-20 p-3 border border-[var(--divider)] bg-[var(--bg-secondary)] text-[var(--text-main)] rounded-lg font-inherit text-sm resize-none"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-2 mb-0 text-right">Saved</p>
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
            className="w-full max-w-full mt-8 p-5 bg-green-500 bg-opacity-10 border border-[var(--accent)] rounded-lg text-center text-[var(--accent)] font-semibold"
          >
            🎉 Category Complete! All {categoryProgress.total} skills mastered.
          </motion.div>
        )}
      </div>
    </div>
  );
}
