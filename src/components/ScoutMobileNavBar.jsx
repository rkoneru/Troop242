import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { scrollToTop } from '../utils/scrollToTop';

export default function ScoutMobileNavBar() {
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
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path.split('-')[0]);

  const handleNavClick = (item) => {
    scrollToTop();
    navigate(item.path);
  };

  return (
    <motion.nav
      className="scout-mobile-nav-bar"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="scout-nav-bar-container">
        {navItems.map((item, idx) => (
          <motion.button
            key={idx}
            className={`scout-nav-icon-btn ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={item.label}
          >
            <span className="scout-nav-icon">{item.emoji}</span>
          </motion.button>
        ))}

        {/* Logout button */}
        <motion.button
          className="scout-nav-icon-btn logout"
          onClick={handleLogout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Logout"
        >
          <span className="scout-nav-icon">🔓</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}
