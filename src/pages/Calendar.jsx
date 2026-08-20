
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Heart } from 'lucide-react';
import { getEvents } from '../utils/adminData';
import '../styles/calendar.css';

const PACKING_LISTS = {
  meetings: ['Uniform (shirt, neckerchief, slide)', 'Scout Handbook', 'Pencil & notebook', 'Water bottle', 'Any merit badge materials'],
  campouts: ['Tent & sleeping bag', 'Change of clothes', 'Toiletries & medications', 'Headlamp or flashlight', 'Warm jacket', 'Sturdy shoes', 'Backpack', 'Water bottle'],
  hikes: ['Comfortable hiking shoes', 'Backpack (20-30L)', 'Water bottle', 'Snacks & lunch', 'Sunscreen', 'Insect repellent', 'Lightweight jacket', 'First aid kit', 'Map or trail info']
};

export default function Calendar() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('meetings');
  const [events, setEvents] = useState([]);
  const [myRsvps, setMyRsvps] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventsData = async () => {
      try {
        const loaded = await getEvents();
        setEvents(loaded);
      } catch (error) {
        console.error('Failed to load events from Firestore:', error);
      }
    };
    loadEventsData();
  }, []);

  // Load user's RSVPs from Firestore
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadRsvps = async () => {
      try {
        const snap = await getDoc(doc(db, 'eventRsvps', user.uid));
        if (snap.exists()) {
          setMyRsvps(snap.data());
        }
      } catch (error) {
        console.error('Error loading RSVPs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRsvps();
  }, [user]);

  // Toggle RSVP for an event
  const toggleRsvp = async (eventId) => {
    if (!user) return;

    const updated = { ...myRsvps };
    updated[eventId] = !updated[eventId];
    if (!updated[eventId]) delete updated[eventId];

    setMyRsvps(updated);

    try {
      await setDoc(doc(db, 'eventRsvps', user.uid), updated, { merge: true });
    } catch (error) {
      console.error('Error saving RSVP:', error);
    }
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="calendar-page">
      {/* Header Section */}
      <section className="hero-page section">
        <div className="container">
          <motion.div
            className="flex flex--col"
            style={{ gap: 16, textAlign: 'center' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants}>📅 Troop 242 Calendar</motion.h1>
            <motion.p variants={itemVariants} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
              Stay updated with all Troop 242 events, meetings, campouts, and activities. Subscribe to get notifications!
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex--center flex--wrap" style={{ gap: 16, marginTop: 24 }}>
              <a
                href="https://calendar.google.com/calendar/r?cid=k11l4b9od26qdlquf6fth7stbg%40group.calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Subscribe to Calendar
              </a>
              <a
                href="mailto:troop242sanford@gmail.com?subject=Calendar%20Question"
                className="btn btn-outline"
              >
                Email Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Calendar Embed Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="calendar-embed-wrapper">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=k11l4b9od26qdlquf6fth7stbg%40group.calendar.google.com&ctz=America%2FNew_York&mode=MONTH&showTitle=1&showNav=1&showPrint=1&showTabs=1&showCalendars=1"
                title="Troop 242 Calendar"
                className="calendar-embed"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Created Events Section */}
      {events.length > 0 && (
        <section className="section section--dark">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              style={{ marginBottom: 40 }}
            >
              <h2 style={{ textAlign: 'center' }}>📌 Upcoming Troop Events</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 12 }}>
                Events created by troop leaders and admins
              </p>
            </motion.div>

            <motion.div
              className="grid grid--cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {events
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(event => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    className="glass-card"
                    style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    <div>
                      <h3 style={{ marginBottom: 8, fontSize: '1.1rem' }}>{event.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        👤 By {event.createdBy || 'Leader'}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: 8, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      {event.date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>📅</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {event.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.signups && event.spots && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>✓</span>
                          <span>{event.signups.length} scout(s) interested</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--divider)' }}>
                        {event.description}
                      </p>
                    )}

                    {user && profile?.role === 'scout' && (
                      <button
                        onClick={() => toggleRsvp(event.id)}
                        aria-pressed={!!myRsvps[event.id]}
                        aria-label={myRsvps[event.id] ? `Remove interest for ${event.title}` : `Mark interest for ${event.title}`}
                        style={{
                          marginTop: 'auto',
                          padding: '10px 16px',
                          background: myRsvps[event.id] ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                          border: `2px solid ${myRsvps[event.id] ? '#ef4444' : 'var(--divider)'}`,
                          color: myRsvps[event.id] ? '#ef4444' : 'var(--text-muted)',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = myRsvps[event.id] ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = myRsvps[event.id] ? 'rgba(239, 68, 68, 0.2)' : 'transparent';
                        }}
                      >
                        <Heart
                          size={18}
                          fill={myRsvps[event.id] ? '#ef4444' : 'none'}
                          stroke="currentColor"
                        />
                        {myRsvps[event.id] ? 'Interested' : 'Mark Interested'}
                      </button>
                    )}

                    {!user && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'auto', textAlign: 'center' }}>
                        Sign in to RSVP to events
                      </p>
                    )}
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 60 }}>Calendar Information</h2>
          </motion.div>

          <motion.div
            className="grid grid--cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              {
                title: 'Weekly Meetings',
                icon: '📍',
                desc: 'Every Tuesday at 7:00 PM. Regular troop meetings with skills, games, and planning.'
              },
              {
                title: 'Monthly Campouts',
                icon: '⛺',
                desc: 'Outdoor camping adventures throughout the year. Sign-ups on calendar.'
              },
              {
                title: 'Special Events',
                icon: '🎉',
                desc: 'Campfire programs, merit badge classes, trips, and special activities.'
              }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What to Bring Section */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 800, margin: '0 auto' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 40 }}>What to Bring</h2>

            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Packing List Categories"
              style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              {['meetings', 'campouts', 'hikes'].map(tab => (
                <motion.button
                  key={tab}
                  id={`tab-${tab}`}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`tabpanel-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === tab ? 'var(--accent)' : 'transparent',
                    color: activeTab === tab ? 'white' : 'var(--text-muted)',
                    border: `2px solid ${activeTab === tab ? 'var(--accent)' : 'var(--divider)'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            {/* Packing List */}
            <motion.div
              key={activeTab}
              id={`tabpanel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{ padding: 32 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {PACKING_LISTS[activeTab].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      background: 'var(--accent-dim)',
                      borderRadius: 8,
                      fontSize: '0.95rem'
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Subscribe CTA Section */}
      <section className="section">
        <div className="container">
          <motion.div
            className="glass-card"
            style={{ padding: 60, textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 style={{ marginBottom: 16 }}>Never Miss an Event</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
              Subscribe to the Troop 242 calendar to get notifications for all meetings, campouts, and events.
            </p>
            <a
              href="https://calendar.google.com/calendar/r?cid=k11l4b9od26qdlquf6fth7stbg%40group.calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '1.1rem', padding: '16px 32px' }}
            >
              Add to Your Calendar
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
