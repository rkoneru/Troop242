import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, ExternalLink, Search, X } from 'lucide-react';
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

  // Search functionality
  const searchAllBadges = () => {
    const results = [];
    BADGE_CATEGORIES.forEach((cat, catIdx) => {
      cat.badges.forEach((badge) => {
        if (badge.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ ...badge, categoryIdx: catIdx, categoryName: cat.category });
        }
      });
    });
    return results;
  };

  // Render state
  const currentCategory = BADGE_CATEGORIES[selectedCategoryIdx];
  const completedCount = getCompletedCountForCategory(selectedCategoryIdx);
  const workingCount = getWorkingCountForCategory(selectedCategoryIdx);
  const searchResults = searchQuery ? searchAllBadges() : [];

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Merit Badge Tracker</h1>
          <div style={{ width: 120 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="🔍 Search badges..."
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
            {showSearchResults && searchResults.length > 0 && (
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
                {searchResults.map((badge, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      cycleBadgeStatus(badge.name);
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
                      <div style={{ fontWeight: 500 }}>{badge.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{badge.categoryName}</div>
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: getStatusColor(badge.name) + '20',
                        color: getStatusColor(badge.name),
                        border: `1px solid ${getStatusColor(badge.name)}`,
                      }}
                    >
                      {getStatusLabel(badge.name)}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
            {showSearchResults && searchResults.length === 0 && searchQuery && (
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
                No badges found matching "{searchQuery}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Selector Grid - Hidden on mobile when selected */}
        {(!isMobile || categoryViewOpen) && (
          <>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: 16, color: 'var(--text-muted)' }}>SELECT CATEGORY</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 48 }}>
              {BADGE_CATEGORIES.map((cat, idx) => {
                const completed = getCompletedCountForCategory(idx);
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
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{completed}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{completedCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed</div>
            </div>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{workingCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>In Progress</div>
            </div>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {currentCategory.badges.length - completedCount - workingCount}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not Started</div>
            </div>
          </div>
        </div>

        {/* Badges List Table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 0, marginBottom: 20, color: 'var(--text-main)' }}>
            Badges in this Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 8, overflow: 'hidden', border: `1px solid var(--divider)` }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr auto',
                gap: 16,
                padding: '16px',
                background: 'var(--bg-primary)',
                borderBottom: `1px solid var(--divider)`,
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
              }}
            >
              <div>Badge Name</div>
              <div style={{ textAlign: 'center' }}>Status</div>
              <div style={{ textAlign: 'center' }}>Link</div>
              <div style={{ textAlign: 'center' }}>Notes</div>
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
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr 1fr auto',
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
                    {/* Badge Name */}
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)' }}>
                      {badge.name}
                    </div>

                    {/* Status Button */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <motion.button
                        onClick={() => cycleBadgeStatus(badge.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '6px 16px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          borderRadius: 20,
                          border: `2px solid ${getStatusColor(badge.name)}`,
                          background: getStatusColor(badge.name) + '20',
                          color: getStatusColor(badge.name),
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          minWidth: 120,
                        }}
                      >
                        {getStatusLabel(badge.name)}
                      </motion.button>
                    </div>

                    {/* Link to Scouting.org */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <motion.a
                        href={badge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ color: 'var(--accent)', cursor: 'pointer', display: 'inline-flex' }}
                      >
                        <ExternalLink size={18} />
                      </motion.a>
                    </div>

                    {/* Expand/Collapse Notes Indicator */}
                    <div
                      onClick={() => setExpandedBadge(isExpanded ? null : badge.name)}
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
                          Notes for {badge.name}
                        </label>
                        <textarea
                          value={note}
                          onChange={(e) => saveBadgeNote(badge.name, e.target.value)}
                          placeholder="Add requirements completed, learning notes, or plans..."
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

        {/* Submit to Scoutbook Button */}
        {hasCompletedInCategory() && (
          <motion.button
            className="btn btn-primary"
            onClick={() => setShowSubmitModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: '100%', maxWidth: 600, margin: '32px auto 0', display: 'block' }}
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
