import { Users, BarChart3, Palette, Lock, HardDrive } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ADMIN_SECTIONS = [
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage scouts, leaders, and administrators',
    icon: Users,
    color: '#00d68f',
    items: [
      { label: 'Total Users', value: '85', subtext: '45 Scouts, 25 Leaders, 15 Parents' },
      { label: 'New This Month', value: '12', subtext: 'Pending verification' },
      { label: 'Active Sessions', value: '23', subtext: 'Currently online' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Reports',
    description: 'View troop statistics and activity reports',
    icon: BarChart3,
    color: '#52b788',
    items: [
      { label: 'Total Activities', value: '34', subtext: 'This year' },
      { label: 'Participation Rate', value: '78%', subtext: 'Average attendance' },
      { label: 'Merit Badges Earned', value: '156', subtext: 'Last 6 months' }
    ]
  },
  {
    id: 'appearance',
    name: 'Theme Settings',
    description: 'Customize website appearance and themes',
    icon: Palette,
    color: '#d4a853',
    link: '/appearance'
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    description: 'Manage security settings and user privacy',
    icon: Lock,
    color: '#ff6b6b',
    items: [
      { label: 'Failed Login Attempts', value: '3', subtext: 'Last 24 hours' },
      { label: 'Two-Factor Auth', value: '92%', subtext: 'Users enabled' },
      { label: 'SSL Certificate', value: 'Valid', subtext: 'Expires in 245 days' }
    ]
  },
  {
    id: 'database',
    name: 'Database Management',
    description: 'Manage database backups and maintenance',
    icon: HardDrive,
    color: '#6496c8',
    items: [
      { label: 'Database Size', value: '245 MB', subtext: 'Current usage' },
      { label: 'Last Backup', value: 'Today', subtext: '02:30 AM' },
      { label: 'Integrity Check', value: 'Passed', subtext: 'All systems normal' }
    ]
  }
];

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState('users');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const currentSection = ADMIN_SECTIONS.find(s => s.id === selectedSection);
  const SectionIcon = currentSection?.icon;

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
            <h1 style={{ marginBottom: 16 }}>⚙️ Admin Control Panel</h1>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
              Full control of Troop 242 website and systems
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Admin Dashboard */}
      <section className="section section--dark">
        <div className="container">
          {/* Maintenance Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: 20,
              background: maintenanceMode ? 'rgba(255, 100, 100, 0.1)' : 'rgba(0, 214, 143, 0.1)',
              borderLeft: `4px solid ${maintenanceMode ? '#ff6464' : '#00d68f'}`,
              borderRadius: 8,
              marginBottom: 40,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <p style={{ color: maintenanceMode ? '#ff6464' : '#00d68f', fontWeight: 600, marginBottom: 4 }}>
                🔧 Maintenance Mode
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                {maintenanceMode ? 'Website is in maintenance mode' : 'Website is operating normally'}
              </p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              style={{
                padding: '8px 16px',
                background: maintenanceMode ? 'rgba(255, 100, 100, 0.2)' : 'rgba(0, 214, 143, 0.2)',
                color: maintenanceMode ? '#ff6464' : '#00d68f',
                border: `1px solid ${maintenanceMode ? 'rgba(255, 100, 100, 0.3)' : 'rgba(0, 214, 143, 0.3)'}`,
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
            >
              {maintenanceMode ? 'Disable' : 'Enable'}
            </button>
          </motion.div>

          {/* Section Navigation */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ marginBottom: 20 }}>Management Sections</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 16
              }}
            >
              {ADMIN_SECTIONS.map((section) => {
                const Icon = section.icon;
                const isSelected = selectedSection === section.id;

                if (section.link) {
                  return (
                    <Link
                      key={section.id}
                      to={section.link}
                      style={{ textDecoration: 'none' }}
                    >
                      <motion.div
                        variants={itemVariants}
                        className="glass-card"
                        style={{
                          padding: 20,
                          cursor: 'pointer',
                          border: isSelected ? `2px solid ${section.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Icon size={32} style={{ color: section.color, marginBottom: 12 }} />
                        <h3 style={{ color: '#fff', marginBottom: 8 }}>{section.name}</h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                          {section.description}
                        </p>
                      </motion.div>
                    </Link>
                  );
                }

                return (
                  <motion.div
                    key={section.id}
                    variants={itemVariants}
                    onClick={() => setSelectedSection(section.id)}
                    className="glass-card"
                    style={{
                      padding: 20,
                      cursor: 'pointer',
                      border: isSelected ? `2px solid ${section.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Icon size={32} style={{ color: section.color, marginBottom: 12 }} />
                    <h3 style={{ color: '#fff', marginBottom: 8 }}>{section.name}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      {section.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Detailed Section View */}
          {currentSection && currentSection.items && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <SectionIcon size={32} style={{ color: currentSection.color }} />
                  <h2 style={{ margin: 0 }}>{currentSection.name}</h2>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 20
                  }}
                >
                  {currentSection.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      style={{
                        padding: 24,
                        background: `rgba(255, 255, 255, 0.04)`,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        borderLeft: `4px solid ${currentSection.color}`
                      }}
                    >
                      <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 8 }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: currentSection.color, marginBottom: 8 }}>
                        {item.value}
                      </p>
                      <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                        {item.subtext}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: 60 }}
          >
            <h2 style={{ marginBottom: 24 }}>System Health</h2>
            <div style={{
              padding: 24,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 8 }}>Server Status</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00d68f' }}></div>
                    <span style={{ color: '#00d68f', fontWeight: 600 }}>Online</span>
                  </div>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 8 }}>Uptime</p>
                  <p style={{ color: '#52b788', fontWeight: 600 }}>99.8%</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 8 }}>Response Time</p>
                  <p style={{ color: '#d4a853', fontWeight: 600 }}>156ms</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 8 }}>Storage</p>
                  <p style={{ color: '#6496c8', fontWeight: 600 }}>42% Used</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
