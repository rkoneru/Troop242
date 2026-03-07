
import { Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const THEMES = {
  current: {
    name: 'Current (Dark)',
    bg: '#050a24',
    accent: '#00d68f',
    description: 'Original dark theme with scout green accent'
  },
  white: {
    name: 'Light',
    bg: '#ffffff',
    accent: '#00a86b',
    description: 'Clean white background with dark text'
  },
  green: {
    name: 'Scout Green',
    bg: '#1a472a',
    accent: '#4CAF50',
    description: 'Deep scout green background'
  },
  tan: {
    name: 'Scout Tan',
    bg: '#D4A574',
    accent: '#8B4513',
    description: 'Traditional scout tan background'
  }
};

export default function Appearance() {
  const [currentTheme, setCurrentTheme] = useState('current');

  const applyTheme = (themeName) => {
    const theme = THEMES[themeName];
    document.documentElement.style.setProperty('--bg-color', theme.bg);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    localStorage.setItem('troopTheme', themeName);
  };

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('troopTheme') || 'current';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Header */}
      <section className="section section--hero section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>🎨 Appearance</h1>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
              Customize your Troop 242 website experience with your preferred color theme
            </p>
          </motion.div>
        </div>
      </section>

      {/* Theme Selector */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ marginBottom: 48 }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Choose Your Theme</h2>
            <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px' }}>
              Select a color scheme that best suits your preference. Your choice will be saved automatically.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}
            >
              {Object.entries(THEMES).map(([key, theme]) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className="glass-card"
                  onClick={() => handleThemeChange(key)}
                  style={{
                    padding: 24,
                    cursor: 'pointer',
                    border: currentTheme === key ? '2px solid #00d68f' : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Theme Preview */}
                  <div
                    style={{
                      width: '100%',
                      height: '120px',
                      borderRadius: '12px',
                      backgroundColor: theme.bg,
                      marginBottom: 16,
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: theme.accent,
                        boxShadow: `0 0 20px ${theme.accent}80`
                      }}
                    />
                  </div>

                  {/* Theme Name */}
                  <h3 style={{ marginBottom: 8, fontSize: '1.2rem', color: '#fff' }}>
                    {theme.name}
                  </h3>

                  {/* Theme Description */}
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: 16 }}>
                    {theme.description}
                  </p>

                  {/* Selection Status */}
                  {currentTheme === key && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        backgroundColor: 'rgba(0, 214, 143, 0.2)',
                        borderRadius: '8px',
                        color: '#00d68f',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        justifyContent: 'center'
                      }}
                    >
                      <span>✓</span>
                      <span>Selected</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Information Section */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              <Palette size={32} style={{ color: '#00d68f' }} />
              <h2 style={{ margin: 0 }}>Theme Information</h2>
            </div>

            <div style={{ textAlign: 'left', color: '#d1d5db', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#00d68f' }}>Current (Dark):</strong> The original Troop 242 website theme with a dark background and vibrant scout green accents for optimal contrast and readability.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#00d68f' }}>Light:</strong> A bright white background perfect for daytime viewing with excellent readability and a professional appearance.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: '#00d68f' }}>Scout Green:</strong> A thematic deep green background inspired by scouting traditions, evoking nature and outdoor adventures.
              </p>
              <p>
                <strong style={{ color: '#00d68f' }}>Scout Tan:</strong> A traditional tan color representing classic scouting heritage and outdoor expeditions.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              style={{
                marginTop: 32,
                padding: 16,
                backgroundColor: 'rgba(0, 214, 143, 0.1)',
                borderRadius: '12px',
                borderLeft: '4px solid #00d68f',
                color: '#9ca3af',
                fontSize: '0.9rem'
              }}
            >
              <p style={{ margin: 0 }}>
                💡 <strong style={{ color: '#00d68f' }}>Tip:</strong> Your theme preference is automatically saved. It will be remembered the next time you visit Troop 242's website.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
