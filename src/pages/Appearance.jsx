
import { Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { THEMES } from '../utils/themes';

export default function Appearance() {
  const [currentTheme, setCurrentTheme] = useState('current');

  const applyTheme = (themeName) => {
    const theme = THEMES[themeName];
    Object.entries(theme.tokens).forEach(([prop, val]) => {
      document.documentElement.style.setProperty(prop, val);
    });
    localStorage.setItem('troopTheme', themeName);
  };

  useEffect(() => {
    const userTheme = localStorage.getItem('troopTheme');
    const adminDefault = localStorage.getItem('troopThemeDefault') || 'current';
    const active = userTheme || adminDefault;
    setCurrentTheme(active);
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
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
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
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px' }}>
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
                    border: currentTheme === key ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
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
                      backgroundColor: theme.tokens['--bg-primary'],
                      marginBottom: 16,
                      border: `2px solid ${theme.tokens['--glass-border']}`,
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
                        backgroundColor: theme.tokens['--accent'],
                        boxShadow: `0 0 20px ${theme.tokens['--accent']}80`
                      }}
                    />
                  </div>

                  {/* Theme Name */}
                  <h3 style={{ marginBottom: 8, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    {theme.name}
                  </h3>

                  {/* Theme Description */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
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
                        backgroundColor: 'var(--accent-dim)',
                        borderRadius: '8px',
                        color: 'var(--accent)',
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
              <Palette size={32} style={{ color: 'var(--accent)' }} />
              <h2 style={{ margin: 0 }}>Theme Information</h2>
            </div>

            <div style={{ textAlign: 'left', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: 'var(--accent)' }}>Current (Dark):</strong> The original Troop 242 website theme with a dark background and vibrant scout green accents for optimal contrast and readability.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: 'var(--accent)' }}>Light:</strong> A bright white background perfect for daytime viewing with excellent readability and a professional appearance.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: 'var(--accent)' }}>Scout Green:</strong> A thematic deep green background inspired by scouting traditions, evoking nature and outdoor adventures.
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong style={{ color: 'var(--accent)' }}>Scout Tan:</strong> A traditional tan color representing classic scouting heritage and outdoor expeditions.
              </p>
              <p>
                <strong style={{ color: 'var(--accent)' }}>Scout Blue:</strong> A deep blue background inspired by scout leadership and unity, with bright blue accents for vibrant visual appeal.
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
                backgroundColor: 'var(--accent-dim)',
                borderRadius: '12px',
                borderLeft: '4px solid var(--accent)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}
            >
              <p style={{ margin: 0 }}>
                💡 <strong style={{ color: 'var(--accent)' }}>Tip:</strong> Your theme preference is saved to your browser. It will be remembered when you visit again.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
