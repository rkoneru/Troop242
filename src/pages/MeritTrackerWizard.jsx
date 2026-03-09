import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { BADGE_CATEGORIES } from './Badges';

export default function MeritTrackerWizard() {
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
  const [meritProgress, setMeritProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('meritProgress') || '{}');
    } catch {
      return {};
    }
  });
  const [meritNotes, setMeritNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('meritNotes') || '{}');
    } catch {
      return {};
    }
  });
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [expandedBadge, setExpandedBadge] = useState(null);
  const [categoryViewOpen, setCategoryViewOpen] = useState(true);

  // Handlers
  const cycleBadgeStatus = (badgeName) => {
    const current = meritProgress[badgeName];
    const next = !current ? 'working' : current === 'working' ? 'completed' : undefined;
    const updated = { ...meritProgress };
    if (next === undefined) delete updated[badgeName];
    else updated[badgeName] = next;
    setMeritProgress(updated);
    localStorage.setItem('meritProgress', JSON.stringify(updated));
  };

  const saveBadgeNote = (badgeName, text) => {
    const updated = { ...meritNotes, [badgeName]: text };
    setMeritNotes(updated);
    localStorage.setItem('meritNotes', JSON.stringify(updated));
  };

  // Compute progress
  const getCompletedCountForCategory = (catIdx) => {
    return BADGE_CATEGORIES[catIdx].badges.filter(
      (b) => meritProgress[b.name] === 'completed'
    ).length;
  };

  const getWorkingCountForCategory = (catIdx) => {
    return BADGE_CATEGORIES[catIdx].badges.filter(
      (b) => meritProgress[b.name] === 'working'
    ).length;
  };

  const hasCompletedInCategory = () => {
    const category = BADGE_CATEGORIES[selectedCategoryIdx];
    return category.badges.some((b) => meritProgress[b.name] === 'completed');
  };

  const generateScoutbookSummary = () => {
    const completed = [];
    const working = [];

    BADGE_CATEGORIES.forEach((cat) => {
      cat.badges.forEach((badge) => {
        const status = meritProgress[badge.name];
        if (status === 'completed') {
          completed.push(`- ${badge.name} (${cat.category}) ✓`);
        } else if (status === 'working') {
          working.push(`- ${badge.name} (${cat.category}) - in progress`);
        }
      });
    });

    const notes = [];
    Object.entries(meritNotes).forEach(([badgeName, note]) => {
      if (note) notes.push(`- ${badgeName}: ${note}`);
    });

    let summary = 'MERIT BADGE PROGRESS SUMMARY\n\n';
    if (completed.length > 0) {
      summary += 'Completed Badges:\n' + completed.join('\n') + '\n\n';
    }
    if (working.length > 0) {
      summary += 'Working On:\n' + working.join('\n') + '\n\n';
    }
    summary += 'Notes:\n' + (notes.length > 0 ? notes.join('\n') : '(No notes added)') + '\n\n';
    summary += '---\n\nNext Steps:\n1. Copy this summary\n2. Log into Scoutbook.org\n3. Enter badges in your Scout profile\n4. Work towards Eagle requirements';

    return summary;
  };

  const handleCopyToClipboard = () => {
    const summary = generateScoutbookSummary();
    navigator.clipboard.writeText(summary).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  // Render state
  const currentCategory = BADGE_CATEGORIES[selectedCategoryIdx];
  const completedCount = getCompletedCountForCategory(selectedCategoryIdx);
  const workingCount = getWorkingCountForCategory(selectedCategoryIdx);

  const getStatusColor = (badgeName) => {
    const status = meritProgress[badgeName];
    if (status === 'completed') return '#22c55e'; // green
    if (status === 'working') return '#f59e0b'; // amber
    return '#6b7280'; // gray
  };

  const getStatusLabel = (badgeName) => {
    const status = meritProgress[badgeName];
    if (status === 'completed') return 'Completed';
    if (status === 'working') return 'In Progress';
    return 'Not Started';
  };

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
          <h1 className="text-2xl font-semibold">Merit Badge Tracker</h1>
          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Category Selector Grid - Hidden on mobile when category is selected */}
        {categoryViewOpen && (
          <>
            <h2 className="text-sm font-semibold mb-4 text-[var(--text-muted)] mt-0">SELECT CATEGORY</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
              {BADGE_CATEGORIES.map((cat, idx) => {
                const completed = getCompletedCountForCategory(idx);
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
                    <div className="text-xl font-bold text-[var(--accent)]">{completed}</div>
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
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{completedCount}</div>
              <div className="text-xs text-[var(--text-muted)]">Completed</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">{workingCount}</div>
              <div className="text-xs text-[var(--text-muted)]">In Progress</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-[var(--text-muted)]">
                {currentCategory.badges.length - completedCount - workingCount}
              </div>
              <div className="text-xs text-[var(--text-muted)]">Not Started</div>
            </div>
          </div>
        </div>

        {/* Badges List Table */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mt-0 mb-5 text-[var(--text-main)]">
            Badges in this Category
          </h3>

          <div className="flex flex-col rounded-lg overflow-hidden border border-[var(--divider)]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-4 py-4 bg-[var(--bg-primary)] border-b border-[var(--divider)] font-semibold text-sm text-[var(--text-muted)]">
              <div>Badge Name</div>
              <div className="text-center">Status</div>
              <div className="text-center">Link</div>
              <div className="text-center">Notes</div>
            </div>

            {/* Table Rows */}
            {currentCategory.badges.map((badge, idx) => {
              const status = meritProgress[badge.name];
              const note = meritNotes[badge.name] || '';
              const isExpanded = expandedBadge === badge.name;

              return (
                <div key={idx}>
                  {/* Main Row */}
                  <div
                    className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-4 py-4 border-b border-[var(--divider)] items-center cursor-pointer transition-all hover:bg-[rgba(0,214,143,0.05)]"
                    style={{
                      background: isExpanded ? 'var(--bg-primary)' : 'transparent',
                    }}
                  >
                    {/* Badge Name */}
                    <div className="text-sm font-medium text-[var(--text-main)]">
                      {badge.name}
                    </div>

                    {/* Status Button */}
                    <div className="flex justify-center">
                      <motion.button
                        onClick={() => cycleBadgeStatus(badge.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          borderColor: getStatusColor(badge.name),
                          backgroundColor: getStatusColor(badge.name) + '20',
                          color: getStatusColor(badge.name),
                        }}
                        className="px-4 py-1.5 text-xs font-semibold rounded-full border-2 cursor-pointer transition-all min-w-[120px]"
                      >
                        {getStatusLabel(badge.name)}
                      </motion.button>
                    </div>

                    {/* Link to Scouting.org */}
                    <div className="flex justify-center">
                      <motion.a
                        href={badge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-[var(--accent)] cursor-pointer inline-flex"
                      >
                        <ExternalLink size={18} />
                      </motion.a>
                    </div>

                    {/* Expand/Collapse Notes Indicator */}
                    <div
                      onClick={() => setExpandedBadge(isExpanded ? null : badge.name)}
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
                          Notes for {badge.name}
                        </label>
                        <textarea
                          value={note}
                          onChange={(e) => saveBadgeNote(badge.name, e.target.value)}
                          placeholder="Add requirements completed, learning notes, or plans..."
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

        {/* Submit to Scoutbook Button */}
        {hasCompletedInCategory() && (
          <motion.button
            className="btn btn-primary w-full max-w-xl mx-auto block mt-8"
            onClick={() => setShowSubmitModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit to Scoutbook
          </motion.button>
        )}
      </div>

      {/* Scoutbook Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubmitModal(false)}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000] p-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'var(--bg-secondary)' }}
              className="glass-card max-w-md p-8 rounded-lg max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mt-0 mb-4">Merit Badge Summary</h2>

              <pre className="bg-[var(--bg-primary)] p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap break-words mb-6 font-mono text-[var(--text-main)]">
                {generateScoutbookSummary()}
              </pre>

              <div className="flex flex-col gap-3">
                <motion.button
                  className="btn btn-primary flex items-center justify-center gap-2"
                  onClick={handleCopyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy size={18} /> {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
                </motion.button>

                <motion.a
                  href="https://scoutbook.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline flex items-center justify-center gap-2 no-underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={18} /> Open Scoutbook.org
                </motion.a>

                <motion.button
                  className="btn btn-outline"
                  onClick={() => setShowSubmitModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-5 mb-0">
                ℹ️ Copy this summary and manually enter your merit badges into Scoutbook.org. Your scoutmaster will need to verify completion.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
