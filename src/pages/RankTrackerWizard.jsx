import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, ExternalLink, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { RANKS } from '../data/rankRequirements';

export default function RankTrackerWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [selectedRank, setSelectedRank] = useState(0);
  const [rankChecks, setRankChecks] = useState({});
  const [notes, setNotes] = useState({});
  const [expandedReq, setExpandedReq] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from Firestore when user is available
  useEffect(() => {
    if (!user) return;

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
  }, [user]);

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

  const selectRank = (rankIdx) => {
    setSelectedRank(rankIdx);
  };

  const generateScoutbookSummary = () => {
    const rank = RANKS[selectedRank];
    const completedReqs = [];
    const notesText = [];

    rank.requirements.forEach((req, idx) => {
      const key = `${selectedRank}-${idx}`;
      if (rankChecks[key]) {
        completedReqs.push(`${req.code}. ${req.text} ✓`);
      }
      if (notes[key]) {
        notesText.push(`- Req ${req.code}: ${notes[key]}`);
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

  if (isLoading) {
    return (
      <section style={{ minHeight: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading rank tracker...</p>
        </div>
      </section>
    );
  }

  if (!user) return null;

  const currentRank = RANKS[selectedRank];

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
          padding: '24px',
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
            Back
          </motion.button>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 style={{ marginBottom: 0, fontSize: '1.5rem', textAlign: 'center' }}>Rank Advancement Tracker</h1>
          </motion.div>
          <div style={{ width: '200px' }} />
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '20px', minHeight: 'calc(100vh - 200px)' }}>
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

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: 32, textAlign: 'center' }}
          >
            <p style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: '1rem', fontWeight: 600 }}>
              {currentRank.emoji} {currentRank.name} — {completedCount}/{currentRank.requirements.length} requirements complete
            </p>
            <div style={{ background: 'var(--divider)', borderRadius: 99, height: 8 }}>
              <div
                style={{
                  width: `${(completedCount / currentRank.requirements.length) * 100}%`,
                  background: 'var(--accent)',
                  height: '100%',
                  borderRadius: 99,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </motion.div>

          {/* Requirements List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentRank.requirements.map((req, idx) => {
                const reqKey = `${selectedRank}-${idx}`;
                const isChecked = rankChecks[reqKey];
                const reqNotes = notes[reqKey] || '';
                const isExpanded = expandedReq === idx;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      background: isChecked ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary)',
                      border: isChecked ? '1px solid #10b981' : '1px solid var(--divider)',
                      borderRadius: 12,
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Header Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                      onClick={() => setExpandedReq(isExpanded ? null : idx)}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRequirement(selectedRank, idx);
                        }}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: `2px solid ${isChecked ? 'var(--accent)' : 'var(--divider)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isChecked ? 'var(--accent)' : 'transparent',
                          cursor: 'pointer',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {isChecked && <Check size={16} color="white" />}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span
                            style={{
                              display: 'inline-block',
                              background: 'var(--accent)',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {req.code}
                          </span>
                          <span
                            style={{
                              textDecoration: isChecked ? 'line-through' : 'none',
                              color: isChecked ? 'var(--text-muted)' : 'inherit',
                              fontSize: '0.95rem',
                            }}
                          >
                            {req.text}
                          </span>
                        </div>

                        {/* Notes Preview */}
                        {reqNotes && !isExpanded && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                            {reqNotes.substring(0, 60)}{reqNotes.length > 60 ? '...' : ''}
                          </p>
                        )}
                      </div>

                      {/* Expand Icon */}
                      <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Expanded Notes Section */}
                    {isExpanded && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--divider)' }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem' }}>
                          Notes & Evidence
                        </label>
                        <textarea
                          value={reqNotes}
                          onChange={(e) => saveNotes(selectedRank, idx, e.target.value)}
                          onBlur={() => saveNotes(selectedRank, idx, reqNotes)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Add notes about how you completed this requirement (optional)..."
                          style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: 12,
                            borderRadius: 8,
                            border: '1px solid var(--divider)',
                            background: 'var(--bg-primary)',
                            color: 'inherit',
                            fontFamily: 'inherit',
                            fontSize: '0.9rem',
                            resize: 'vertical',
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

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


          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: 40, marginBottom: 40 }}
          >
            {allComplete ? (
              <motion.button
                className="btn btn-primary"
                onClick={() => setShowSubmitModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, var(--accent), #059669)',
                  border: 'none',
                  borderRadius: 12,
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                ✓ All Requirements Complete — Submit to Scoutbook
              </motion.button>
            ) : (
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px dashed var(--divider)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  Complete all {currentRank.requirements.length} requirements above to submit
                </p>
              </div>
            )}
          </motion.div>
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
