import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { search } from '../utils/SearchIndex';
import '../styles/search-widget.css';

export default function SearchWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const resultItemRefs = useRef([]);

  // Listen for open-search custom event
  useEffect(() => {
    const handler = () => {
      triggerRef.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener('open-search', handler);
    return () => window.removeEventListener('open-search', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        triggerRef.current = document.activeElement;
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus management on open / close
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    } else if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
      triggerRef.current.focus();
    }
  }, [open]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length >= 2) {
      setResults(search(val));
    } else {
      setResults([]);
    }
    setSelectedIndex(-1);
  };

  // Ensure active search result item scrolls into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultItemRefs.current[selectedIndex]) {
      if (typeof resultItemRefs.current[selectedIndex].scrollIntoView === 'function') {
        resultItemRefs.current[selectedIndex].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  const handleOpen = () => {
    triggerRef.current = document.activeElement;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

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

  const handleInputKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < results.length) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    }
  };

  return (
    <>
      {/* Floating Search Button */}
      <motion.button
        type="button"
        className="search-fab"
        onClick={handleOpen}
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
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Search site content"
          >
            <motion.div
              className="search-panel"
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
                  type="search"
                  className="search-input"
                  placeholder="Search ranks, badges, events, skills..."
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleInputKeyDown}
                  aria-label="Search query"
                  aria-autocomplete="list"
                  aria-controls={results.length > 0 ? 'search-results-list' : undefined}
                  aria-activedescendant={
                    selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined
                  }
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    className="btn-clear-search"
                    onClick={handleClear}
                    aria-label="Clear search query"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  className="btn-close-search"
                  onClick={handleClose}
                  aria-label="Close search"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Search Results */}
              {results.length > 0 && (
                <div
                  id="search-results-list"
                  className="search-results"
                  role="listbox"
                  aria-label="Search results"
                  aria-live="polite"
                >
                  {results.map((result, i) => (
                    <button
                      key={i}
                      id={`search-option-${i}`}
                      ref={(el) => (resultItemRefs.current[i] = el)}
                      type="button"
                      role="option"
                      aria-selected={selectedIndex === i}
                      className={`search-result-item ${selectedIndex === i ? 'is-selected' : ''}`}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <span className="search-result-icon" aria-hidden="true">{result.icon}</span>
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
                        onClick={() => handleQueryChange({ target: { value: suggestion } })}
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
