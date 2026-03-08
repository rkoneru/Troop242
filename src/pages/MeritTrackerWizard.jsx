import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Copy, ExternalLink } from 'lucide-react';
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
  const [currentBadgeIdx, setCurrentBadgeIdx] = useState(0);
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

  const nextBadge = () => {
    const currentCategory = BADGE_CATEGORIES[selectedCategoryIdx];
    if (currentBadgeIdx < currentCategory.badges.length - 1) {
      setCurrentBadgeIdx(currentBadgeIdx + 1);
    }
  };

  const prevBadge = () => {
    if (currentBadgeIdx > 0) {
      setCurrentBadgeIdx(currentBadgeIdx - 1);
    }
  };

  const selectCategory = (catIdx) => {
    setSelectedCategoryIdx(catIdx);
    setCurrentBadgeIdx(0);
  };

  // Compute progress
  const getCompletedCountForCategory = (catIdx) => {
    return BADGE_CATEGORIES[catIdx].badges.filter(
      (b) => meritProgress[b.name] === 'completed'
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
  const currentBadge = currentCategory.badges[currentBadgeIdx];
  const badgeStatus = meritProgress[currentBadge.name];
  const currentNote = meritNotes[currentBadge.name] || '';

  const statusColor =
    badgeStatus === 'completed'
      ? 'var(--accent)'
      : badgeStatus === 'working'
      ? '#f59e0b'
      : 'var(--divider)';

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Merit Badge Tracker</h1>
          <div style={{ width: 120 }} />
        </div>
      </div>

      {/* Category Selector Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: 16, color: 'var(--text-muted)' }}>SELECT CATEGORY</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, marginBottom: 48 }}>
          {BADGE_CATEGORIES.map((cat, idx) => {
            const completed = getCompletedCountForCategory(idx);
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{completed} completed</div>
              </motion.button>
            );
          })}
        </div>

        {/* Breadcrumb & Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            {currentCategory.emoji} {currentCategory.category} • Badge {currentBadgeIdx + 1} of {currentCategory.badges.length}
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              style={{
                height: '100%',
                background: 'var(--accent)',
                width: `${((currentBadgeIdx + 1) / currentCategory.badges.length) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div style={{ maxWidth: 600, margin: '0 auto 48px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategoryIdx}-${currentBadgeIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{ padding: 32 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{currentBadge.name}</h2>
                <motion.a
                  href={currentBadge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ color: 'var(--accent)', cursor: 'pointer', display: 'inline-flex' }}
                >
                  <ExternalLink size={20} />
                </motion.a>
              </div>

              {/* 3-State Toggle Button */}
              <div style={{ marginBottom: 24 }}>
                <motion.button
                  onClick={() => cycleBadgeStatus(currentBadge.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 8,
                    border: `2px solid ${statusColor}`,
                    background: statusColor === 'var(--divider)' ? 'transparent' : statusColor + '20',
                    color: statusColor === 'var(--divider)' ? 'var(--text-muted)' : statusColor,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {!badgeStatus
                    ? 'Not Started'
                    : badgeStatus === 'working'
                    ? '⏳ Working On'
                    : '✓ Completed'}
                </motion.button>
                <p style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Click to cycle through progress stages
                </p>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: 8, color: 'var(--text-muted)' }}>
                  Notes (optional)
                </label>
                <textarea
                  value={currentNote}
                  onChange={(e) => saveBadgeNote(currentBadge.name, e.target.value)}
                  placeholder="Add requirements completed, learning notes, or plans..."
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

        {/* Navigation */}
        <div style={{ maxWidth: 600, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <motion.button
            className="btn btn-outline"
            onClick={prevBadge}
            disabled={currentBadgeIdx === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ opacity: currentBadgeIdx === 0 ? 0.5 : 1 }}
          >
            <ChevronLeft size={18} /> Previous
          </motion.button>

          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {currentBadgeIdx + 1} of {currentCategory.badges.length}
          </div>

          <motion.button
            className="btn btn-primary"
            onClick={nextBadge}
            disabled={currentBadgeIdx === currentCategory.badges.length - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ opacity: currentBadgeIdx === currentCategory.badges.length - 1 ? 0.5 : 1 }}
          >
            Next <ChevronRight size={18} />
          </motion.button>
        </div>

        {/* Submit to Scoutbook Button */}
        {hasCompletedInCategory() && (
          <motion.button
            className="btn btn-primary"
            onClick={() => setShowSubmitModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'block' }}
          >
            Submit to Scoutbook
          </motion.button>
        )}
      </div>

      {/* Scoutbook Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            className="glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubmitModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
            }}
          >
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 500,
                background: 'var(--bg-secondary)',
                padding: 32,
                borderRadius: 12,
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 0, marginBottom: 16 }}>Merit Badge Summary</h2>

              <pre
                style={{
                  background: 'var(--bg-primary)',
                  padding: 16,
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  marginBottom: 24,
                  fontFamily: 'monospace',
                  color: 'var(--text-main)',
                }}
              >
                {generateScoutbookSummary()}
              </pre>

              <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                <motion.button
                  className="btn btn-primary"
                  onClick={handleCopyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <Copy size={18} /> {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
                </motion.button>

                <motion.a
                  href="https://scoutbook.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
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

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 20, marginBottom: 0 }}>
                ℹ️ Copy this summary and manually enter your merit badges into Scoutbook.org. Your scoutmaster will need to verify completion.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
