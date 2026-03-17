
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Header() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleNavClick = (callback) => (e) => {
    scrollToTop();
    callback && callback(e);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/member-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [guideDropdownOpen, setGuideDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [guideDropdownTimeout, setGuideDropdownTimeout] = useState(null);
  const [resourcesDropdownTimeout, setResourcesDropdownTimeout] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleGuideMouseEnter = () => {
    clearTimeout(guideDropdownTimeout);
    setGuideDropdownOpen(true);
  };

  const handleGuideMouseLeave = () => {
    const timeout = setTimeout(() => setGuideDropdownOpen(false), 300);
    setGuideDropdownTimeout(timeout);
  };

  const handleResourcesMouseEnter = () => {
    clearTimeout(resourcesDropdownTimeout);
    setResourcesDropdownOpen(true);
  };

  const handleResourcesMouseLeave = () => {
    const timeout = setTimeout(() => setResourcesDropdownOpen(false), 300);
    setResourcesDropdownTimeout(timeout);
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header-content">
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, color: 'inherit' }}>
          <div className="header-logo">
            <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>⚜️</div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Troop 242</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sanford, FL</div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav">
          <Link to="/" onClick={handleNavClick()} className="header-nav-link">Home</Link>

          {/* Guide Dropdown */}
          <div className="header-dropdown" onMouseEnter={handleGuideMouseEnter} onMouseLeave={handleGuideMouseLeave}>
            <button className="header-dropdown-toggle">
              Guide
              <ChevronDown size={16} style={{ transition: 'transform 0.3s', transform: guideDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {guideDropdownOpen && (
              <motion.div
                className="header-dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/new-scout" onClick={handleNavClick()} className="header-dropdown-item">New Scout</Link>
                <Link to="/scout-principles" onClick={handleNavClick()} className="header-dropdown-item">Scout Principles</Link>
                <Link to="/skills" onClick={handleNavClick()} className="header-dropdown-item">Scout Skills</Link>
                <Link to="/ranks" onClick={handleNavClick()} className="header-dropdown-item">Scout Ranks</Link>
                <Link to="/badges" onClick={handleNavClick()} className="header-dropdown-item">Merit Badges</Link>
                <Link to="/glossary" onClick={handleNavClick()} className="header-dropdown-item">Glossary</Link>
              </motion.div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="header-dropdown" onMouseEnter={handleResourcesMouseEnter} onMouseLeave={handleResourcesMouseLeave}>
            <button className="header-dropdown-toggle">
              Resources
              <ChevronDown size={16} style={{ transition: 'transform 0.3s', transform: resourcesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {resourcesDropdownOpen && (
              <motion.div
                className="header-dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <a href="https://www.scouting.org" target="_blank" rel="noopener noreferrer" className="header-dropdown-item">Scouting America</a>
                <a href="https://scoutbook.scouting.org/" target="_blank" rel="noopener noreferrer" className="header-dropdown-item">Scoutbook</a>
                <Link to="/calendar" onClick={handleNavClick()} className="header-dropdown-item">Troop Calendar</Link>
                <Link to="/member-login" onClick={handleNavClick()} className="header-dropdown-item">Member Login</Link>
              </motion.div>
            )}
          </div>

          <Link to="/about" onClick={handleNavClick()}>About</Link>
          <Link to="/stories" onClick={handleNavClick()}>Stories</Link>
          <Link to="/contact" onClick={handleNavClick()}>Contact</Link>
        </nav>

        {/* User + Search + Mobile Toggle */}
        <div className="header-actions">
          {user && profile && (
            <div className="header-user-menu" style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div className="header-user-avatar" style={{ width: '32px', height: '32px', margin: 0 }}>
                  {profile.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="header-user-name">{profile.name}</span>
                <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--divider)',
                      borderRadius: '8px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      minWidth: '200px',
                      zIndex: 1000
                    }}
                  >
                    <Link
                      to="/profile"
                      onClick={() => {
                        scrollToTop();
                        setUserMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--divider)',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <User size={16} /> My Profile
                    </Link>

                    {['leader', 'admin'].includes(profile?.role) && (
                      <>
                        <Link
                          to="/referral-links"
                          onClick={() => {
                            scrollToTop();
                            setUserMenuOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--divider)',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          🔗 Referral Links
                        </Link>
                       {/*  <Link
                          to="/send-invitations"
                          onClick={() => {
                            scrollToTop();
                            setUserMenuOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--divider)',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          📧 Send Invitations
                        </Link> */}
                      </>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        textAlign: 'left',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button className="btn-search" onClick={handleSearchClick} aria-label="Search (Ctrl+K)">
            <Search size={18} />
          </button>

          <button
            className="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="header-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" onClick={handleNavClick(() => setMobileMenuOpen(false))}>Home</Link>

            {/* Mobile Guide Dropdown */}
            <div className="header-mobile-dropdown">
              <button
                className="header-mobile-dropdown-toggle"
                onClick={() => setGuideDropdownOpen(!guideDropdownOpen)}
              >
                Guide
                <ChevronDown size={16} style={{ transition: 'transform 0.3s', transform: guideDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {guideDropdownOpen && (
                <motion.div
                  className="header-mobile-dropdown-menu"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/new-scout" onClick={handleNavClick(() => { setMobileMenuOpen(false); setGuideDropdownOpen(false); })} className="header-mobile-dropdown-item">New Scout Guide</Link>
                  <Link to="/ranks" onClick={handleNavClick(() => { setMobileMenuOpen(false); setGuideDropdownOpen(false); })} className="header-mobile-dropdown-item">Ranks</Link>
                  <Link to="/badges" onClick={handleNavClick(() => { setMobileMenuOpen(false); setGuideDropdownOpen(false); })} className="header-mobile-dropdown-item">Badges</Link>
                  <Link to="/skills" onClick={handleNavClick(() => { setMobileMenuOpen(false); setGuideDropdownOpen(false); })} className="header-mobile-dropdown-item">Skills</Link>
                  <Link to="/scout-principles" onClick={handleNavClick(() => { setMobileMenuOpen(false); setGuideDropdownOpen(false); })} className="header-mobile-dropdown-item">Scout Principles</Link>
                  <Link to="/glossary" onClick={handleNavClick(() => { setMobileMenuOpen(false); setGuideDropdownOpen(false); })} className="header-mobile-dropdown-item">Glossary</Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Resources Dropdown */}
            <div className="header-mobile-dropdown">
              <button
                className="header-mobile-dropdown-toggle"
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
              >
                Resources
                <ChevronDown size={16} style={{ transition: 'transform 0.3s', transform: resourcesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {resourcesDropdownOpen && (
                <motion.div
                  className="header-mobile-dropdown-menu"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="https://www.scouting.org" target="_blank" rel="noopener noreferrer" onClick={() => { setMobileMenuOpen(false); setResourcesDropdownOpen(false); }} className="header-mobile-dropdown-item">Scouting.org</a>
                  <a href="https://scoutbook.scouting.org/" target="_blank" rel="noopener noreferrer" onClick={() => { setMobileMenuOpen(false); setResourcesDropdownOpen(false); }} className="header-mobile-dropdown-item">Scoutbook</a>
                  <Link to="/calendar" onClick={handleNavClick(() => { setMobileMenuOpen(false); setResourcesDropdownOpen(false); })} className="header-mobile-dropdown-item">Troop Calendar</Link>
                  <Link to="/member-login" onClick={handleNavClick(() => { setMobileMenuOpen(false); setResourcesDropdownOpen(false); })} className="header-mobile-dropdown-item">Member Login</Link>
                </motion.div>
              )}
            </div>

            <Link to="/about" onClick={handleNavClick(() => setMobileMenuOpen(false))}>About</Link>
            <Link to="/stories" onClick={handleNavClick(() => setMobileMenuOpen(false))}>Stories</Link>
            <Link to="/contact" onClick={handleNavClick(() => setMobileMenuOpen(false))}>Contact</Link>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                handleSearchClick();
                setMobileMenuOpen(false);
              }}
            >
              <Search size={16} /> Search
            </button>

            {user && profile && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                <Link to="/profile" onClick={handleNavClick(() => setMobileMenuOpen(false))} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} /> My Profile
                </Link>

                {['leader', 'admin'].includes(profile?.role) && (
                  <>
                    <Link to="/referral-links" onClick={handleNavClick(() => setMobileMenuOpen(false))} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                      🔗 Referral Links
                    </Link>
                    {/* <Link to="/send-invitations" onClick={handleNavClick(() => setMobileMenuOpen(false))} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                      📧 Send Invitations
                    </Link> */}
                  </>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '0.5rem 0',
                    marginTop: '0.5rem'
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
