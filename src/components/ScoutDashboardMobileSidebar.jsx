import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { scrollToTop } from '../utils/scrollToTop';
import '../styles/scout-mobile-bottom-nav.css';

export default function ScoutDashboardMobileSidebar({ hideActive = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/member-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { emoji: '⛺', label: 'Dashboard', path: '/scout-dashboard' },
    { emoji: '⚜️', label: 'Rank', path: '/rank-tracker' },
    { emoji: '🎖️', label: 'Badges', path: '/merit-tracker' },
    { emoji: '⚡', label: 'Skills', path: '/skills-tracker' },
    { emoji: '📅', label: 'Activities', path: '/activities' },
    { emoji: '🏆', label: 'Awards', path: '/misc-awards' },
    { emoji: '🗺️', label: 'Portal', path: '/Troop242/Games/scout-portal.html', external: true }
  ];

  const handleNavClick = (item) => {
    scrollToTop();
    if (item.external) {
      const link = document.createElement('a');
      link.href = item.path;
      link.click();
    } else {
      navigate(item.path);
    }
  };

  const isActive = (path) => {
    if (path === '/scout-dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      className="scout-mobile-bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="scout-mobile-bottom-nav-container">
        {navItems.map((item, idx) => {
          const active = isActive(item.path);
          // Hide the active item if hideActive is true
          if (hideActive && active) return null;

          return (
            <motion.button
              key={idx}
              className={`scout-mobile-bottom-nav-item ${active ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              {item.emoji}
            </motion.button>
          );
        })}

        <motion.button
          className="scout-mobile-bottom-nav-item logout"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Logout"
        >
          🔓
        </motion.button>
      </div>
    </motion.nav>
  );
}
