import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, Check, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const RANKS = [
  {
    name: 'Scout',
    emoji: '⚜️',
    requirements: ['Join a Troop', 'Understand Scout Oath & Law', 'Learn Scout Skills'],
  },
  {
    name: 'Tenderfoot',
    emoji: '🎖️',
    requirements: ['2 Months in Troop', 'Camping Skills', 'Cooking & Fire Safety', 'Knot Tying'],
  },
  {
    name: '2nd Class',
    emoji: '🗝️',
    requirements: ['3 Months Service', 'Navigation Skills', 'First Aid', 'Outdoor Survival'],
  },
  {
    name: '1st Class',
    emoji: '🛡️',
    requirements: ['6 Months Since Last', 'Leadership Experience', 'Communication', 'Swimming/Hiking'],
  },
  {
    name: 'Star',
    emoji: '⭐',
    requirements: ['4 Months Service', '5 Merit Badges', 'Project Leadership', 'Service Hours'],
  },
  {
    name: 'Life',
    emoji: '✨',
    requirements: ['4 Months Service', '8 Merit Badges', 'Significant Project', 'Community Impact'],
  },
  {
    name: 'Eagle',
    emoji: '🦅',
    requirements: ['Eagle Project', '21 Merit Badges', 'Life Skills Mastery', 'Character Excellence'],
  },
];

export default function RankTrackerWizard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // State management
  const [selectedRank, setSelectedRank] = useState(0);
  const [currentReqIdx, setCurrentReqIdx] = useState(0);
  const [rankChecks, setRankChecks] = useState({});
  const [notes, setNotes] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from Firestore on mount
  useEffect(() => {
    if (loading) return;

    if (!user || profile?.role !== 'scout') {
      navigate('/member-login');
      return;
    }

    const loadProgress = async () => {
      try {
        const snap = await getDoc(doc(db, 'progress', user.uid));
        const data = snap.data() || {};
        setRankChecks(data.rankChecks || {});
        setNotes(data.requirementNotes || {});
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user, profile, loading, navigate]);

  // Handlers
  const toggleRequirement = async (rankIdx, reqIdx) => {
    const key = `${rankIdx}-${reqIdx}`;
    const updated = { ...rankChecks, [key]: !rankChecks[key] };
    setRankChecks(updated);

    // Save to Firestore
    if (user) {
      try {
        await setDoc(
          doc(db, 'progress', user.uid),
          { rankChecks: updated },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const saveNotes = async (rankIdx, reqIdx, noteText) => {
    const key = `${rankIdx}-${reqIdx}`;
    const updated = { ...notes, [key]: noteText };
    setNotes(updated);

    // Save to Firestore
    if (user) {
      try {
        await setDoc(
          doc(db, 'progress', user.uid),
          { requirementNotes: updated },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  };

  const nextRequirement = () => {
    const currentRank = RANKS[selectedRank];
    if (currentReqIdx < currentRank.requirements.length - 1) {
      setCurrentReqIdx(currentReqIdx + 1);
    }
  };

  const prevRequirement = () => {
    if (currentReqIdx > 0) {
      setCurrentReqIdx(currentReqIdx - 1);
    }
  };

  const selectRank = (rankIdx) => {
    setSelectedRank(rankIdx);
    setCurrentReqIdx(0);
  };

  const generateScoutbookSummary = () => {
    const rank = RANKS[selectedRank];
    const completedReqs = [];
    const notesText = [];

    rank.requirements.forEach((req, idx) => {
      const key = `${selectedRank}-${idx}`;
      if (rankChecks[key]) {
        completedReqs.push(`${idx + 1}. ${req} ✓`);
      }
      if (notes[key]) {
        notesText.push(`- Req ${idx + 1}: ${notes[key]}`);
      }
    });

    const summary = `RANK ADVANCEMENT SUMMARY - ${rank.name.toUpperCase()}

Completed Requirements:
${completedReqs.join('\n')}

Notes:
${notesText.length > 0 ? notesText.join('\n') : '(No notes added)'}

---

Next Steps:
1. Copy this summary
2. Log into Scoutbook.org
3. Enter requirements in your Scout profile
4. Schedule Board of Review with your Scoutmaster`;

    return summary;
  };

  const copyToClipboard = () => {
    const summary = generateScoutbookSummary();
    navigator.clipboard.writeText(summary).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  if (loading || isLoading) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading rank tracker...</p>
        </div>
      </section>
    );
  }

  if (!user) return null;

  const currentRank = RANKS[selectedRank];
  const currentReq = currentRank.requirements[currentReqIdx];
  const reqKey = `${selectedRank}-${currentReqIdx}`;
  const isChecked = rankChecks[reqKey];
  const currentNotes = notes[reqKey] || '';

  // Count completed requirements in current rank
  let completedCount = 0;
  currentRank.requirements.forEach((_, idx) => {
    if (rankChecks[`${selectedRank}-${idx}`]) completedCount++;
  });
  const allComplete = completedCount === currentRank.requirements.length;

  return (
    <>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))',
          padding: '24px 0',
          borderBottom: '1px solid var(--divider)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.button
            className="btn btn-outline"
            onClick={() => navigate('/scout-dashboard')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </motion.button>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 style={{ marginBottom: 0, fontSize: '1.5rem', textAlign: 'center' }}>Rank Advancement Tracker</h1>
          </motion.div>
          <div style={{ width: '200px' }} />
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '40px 20px', minHeight: 'calc(100vh - 200px)' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Rank Selector */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: 12,
              marginBottom: 40,
              padding: 20,
              background: 'var(--bg-secondary)',
              borderRadius: 12,
            }}
          >
            {RANKS.map((rank, idx) => {
              let rankComplete = 0;
              rank.requirements.forEach((_, reqIdx) => {
                if (rankChecks[`${idx}-${reqIdx}`]) rankComplete++;
              });
              const isSelected = selectedRank === idx;

              return (
                <motion.button
                  key={idx}
                  onClick={() => selectRank(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--divider)',
                    background: isSelected ? 'var(--bg-primary)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '1.8rem' }}>{rank.emoji}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rank.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {rankComplete}/{rank.requirements.length}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Breadcrumb & Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: 32, textAlign: 'center' }}
          >
            <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
              {currentRank.emoji} {currentRank.name} {'>'} Requirement {currentReqIdx + 1} of {currentRank.requirements.length}
            </p>
            <div style={{ background: 'var(--divider)', borderRadius: 99, height: 8 }}>
              <div
                style={{
                  width: `${((currentReqIdx + 1) / currentRank.requirements.length) * 100}%`,
                  background: 'var(--accent)',
                  height: '100%',
                  borderRadius: 99,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </motion.div>

          {/* Wizard Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedRank}-${currentReqIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{
                padding: 40,
                marginBottom: 40,
                border: isChecked ? '2px solid var(--accent)' : '1px solid var(--divider)',
              }}
            >
              {/* Requirement Text */}
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <h2 style={{ marginBottom: 16, fontSize: '2rem', marginTop: 0 }}>
                  {currentReq}
                </h2>
              </div>

              {/* Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 32,
                  padding: 16,
                  background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
                onClick={() => toggleRequirement(selectedRank, currentReqIdx)}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `2px solid ${isChecked ? 'var(--accent)' : 'var(--divider)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isChecked ? 'var(--accent)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isChecked && <Check size={24} color="white" />}
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {isChecked ? 'Completed' : 'Mark as Complete'}
                </span>
              </div>

              {/* Notes Field */}
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', marginBottom: 12, fontWeight: 600 }}>
                  Notes {'&'} Evidence
                </label>
                <textarea
                  value={currentNotes}
                  onChange={(e) => saveNotes(selectedRank, currentReqIdx, e.target.value)}
                  onBlur={() => saveNotes(selectedRank, currentReqIdx, currentNotes)}
                  placeholder="Add notes about how you completed this requirement (optional)..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid var(--divider)',
                    background: 'var(--bg-primary)',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Auto-save Indicator */}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textAlign: 'right' }}>
                💾 Auto-saved
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Board of Review Ready (only shows when all complete) */}
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: 24,
                borderRadius: 12,
                border: '2px solid #10b981',
                background: 'rgba(16, 185, 129, 0.05)',
                marginBottom: 40,
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#10b981' }}>
                ✓ Ready for Board of Review
              </p>
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                All requirements for {currentRank.name} rank are complete!
              </p>
            </motion.div>
          )}

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 20,
              marginBottom: 40,
              flexWrap: 'wrap',
            }}
          >
            <motion.button
              className="btn btn-outline"
              onClick={prevRequirement}
              disabled={currentReqIdx === 0}
              whileHover={{ scale: currentReqIdx === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentReqIdx === 0 ? 1 : 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: currentReqIdx === 0 ? 0.5 : 1,
                cursor: currentReqIdx === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={20} />
              Previous
            </motion.button>

            <span style={{ fontWeight: 600, minWidth: '150px', textAlign: 'center' }}>
              Step {currentReqIdx + 1} of {currentRank.requirements.length}
            </span>

            <motion.button
              className="btn btn-primary"
              onClick={nextRequirement}
              disabled={currentReqIdx === currentRank.requirements.length - 1}
              whileHover={{ scale: currentReqIdx === currentRank.requirements.length - 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentReqIdx === currentRank.requirements.length - 1 ? 1 : 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: currentReqIdx === currentRank.requirements.length - 1 ? 0.5 : 1,
                cursor: currentReqIdx === currentRank.requirements.length - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Next
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Submit to Scoutbook Button */}
          {allComplete && (
            <motion.button
              className="btn btn-primary"
              onClick={() => setShowSubmitModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: '100%', padding: '16px 24px', fontSize: '1rem', marginBottom: 40 }}
            >
              Submit to Scoutbook
            </motion.button>
          )}
        </div>
      </section>

      {/* Scoutbook Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubmitModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                padding: 32,
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 24 }}>Submit to Scoutbook</h3>

              <div
                style={{
                  background: 'var(--bg-primary)',
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 24,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '300px',
                  overflow: 'auto',
                  color: 'var(--text-muted)',
                }}
              >
                {generateScoutbookSummary()}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <motion.button
                  className="btn btn-primary"
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
                >
                  <Copy size={18} />
                  {copiedToClipboard ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                </motion.button>

                <motion.a
                  href="https://www.scoutbook.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={18} />
                  Open Scoutbook.org
                </motion.a>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                <strong>Next Steps:</strong>
                <br />
                1. Copy the summary above
                <br />
                2. Log into Scoutbook.org
                <br />
                3. Paste the requirements into your Scout profile
                <br />
                4. Schedule a Board of Review with your Scoutmaster
              </p>

              <motion.button
                className="btn btn-outline"
                onClick={() => setShowSubmitModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: '100%' }}
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
