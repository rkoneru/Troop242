import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, ExternalLink } from 'lucide-react';
import { search } from '../utils/SearchIndex';
import '../styles/search-widget.css';

export default function SearchWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Listen for open-search custom event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-search', handler);
    return () => window.removeEventListener('open-search', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    const performSearch = () => {
      if (query.length >= 2) {
        const searchResults = search(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    };

    performSearch();
  }, [query]);

  const handleResultClick = (result) => {
    setOpen(false);
    setQuery('');

    // External links (http/https) open in new tab
    if (result.url.startsWith('http')) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else {
      // Internal routes use React Router navigate
      navigate(result.url);
    }
  };

  return (
    <>
      {/* Floating Search Button */}
      <motion.button
        type="button"
        className="search-fab"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open search (Ctrl+K)"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Search size={18} aria-hidden="true" />
        <span>Search</span>
      </motion.button>

      {/* Search Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="search-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Search site content"
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="search-input-wrapper">
                <Search size={20} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <input
                  ref={inputRef}
                  id="search-widget-input"
                  type="search"
                  className="search-input"
                  placeholder="Search ranks, badges, events, skills..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search site content"
                  aria-controls="search-results-container"
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    className="btn-clear-query"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search text"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  className="btn-close-search"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Search Results */}
              {results.length > 0 && (
                <div id="search-results-container" className="search-results" role="region" aria-live="polite">
                  {results.map((result, i) => (
                    <button
                      key={i}
                      type="button"
                      className="search-result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      <span className="search-result-icon">{result.icon}</span>
                      <div className="search-result-content">
                        <div className="search-result-title">{result.title}</div>
                        <div className="search-result-excerpt">{result.excerpt.slice(0, 80)}...</div>
                      </div>
                      <span className="search-result-category">{result.category}</span>
                      <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {query.length >= 2 && results.length === 0 && (
                <div className="search-empty" role="status" aria-live="polite">
                  No results for "{query}" — try "Eagle", "camping", or "merit badge"
                </div>
              )}

              {/* Suggestions */}
              {query.length === 0 && (
                <div className="search-suggestions">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try searching for:</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {['Eagle Scout', 'Spring Campout', 'First Aid Badge', 'Camping'].map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        className="search-suggestion-btn"
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
