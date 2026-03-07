
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Users, Zap, Award, MapPin, Clock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import ConstellationBackground from '../components/ConstellationBackground';
import { useState, useEffect, useMemo } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [countdowns, setCountdowns] = useState({});
  const [flipped, setFlipped] = useState({});

  // Event data with dates
  const events = useMemo(() => [
    { id: 'meeting1', date: new Date(2026, 2, 10, 19, 0), day: 'Tuesday', type: 'Meeting', title: 'Weekly Troop Meeting', time: '7:00 PM', location: '3512 S Orlando Dr, Sanford, FL 32773' },
    { id: 'campout', date: new Date(2026, 2, 19, 0, 0), day: 'Thursday', type: 'Campout', title: 'Spring Campout', time: 'All Day', location: 'Keys ', featured: true },
    { id: 'boardreview', date: new Date(2026, 3, 5, 18, 0), day: 'Sunday', type: 'Board Review', title: 'Board of Review', time: '6:00 PM', location: '3512 S Orlando Dr, Sanford, FL 32773' }
  ], []);

  // Generate directions to location
  const getDirections = (location) => {
    const encoded = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/${encoded}`, '_blank');
  };

  // Calculate countdown timers
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const newCountdowns = {};

      events.forEach(event => {
        const diff = event.date - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newCountdowns[event.id] = { days, hours, minutes, seconds };
        } else {
          newCountdowns[event.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });

      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000); // Update every second

    return () => clearInterval(interval);
  }, [events]);

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
    <>
      {/* HERO SECTION */}
      <section className="hero-v2 section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <ConstellationBackground />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            className="flex flex--col flex--center"
            style={{ textAlign: 'center', gap: 24 }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Heading with Letter Reveal */}
            <motion.h1 className="text-shimmer" style={{ fontSize: 'clamp(2.5rem, 10vw, 5.5rem)' }}>
              {Array.from('Build Tomorrow\'s Leaders').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.5 }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: '#9ca3af', maxWidth: 600 }}>
              Adventure · Brotherhood · Eagle Scout Excellence
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex--center flex--wrap">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
              >
                Start Your Journey
              </motion.button>
              <motion.button
                className="btn btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/ranks')}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats Highlights */}
            <motion.div variants={itemVariants} className="grid grid--cols-3" style={{ marginTop: 60, maxWidth: 600 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="stat-counter">80+</div>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Eagle Scouts</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="stat-counter">30</div>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Years Strong</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="stat-counter">50+</div>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Active Scouts</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* COUNTDOWN STRIP */}
      <section className="countdown-strip">
        <div className="container">
          <div className="flex flex--center flex--wrap" style={{ gap: 32 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Next Meeting</h3>
              <div className="countdown-item" style={{ minWidth: 140 }}>
                <div className="countdown-number">7</div>
                <div className="countdown-label">Days</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Next Event</h3>
              <div className="countdown-item" style={{ minWidth: 140 }}>
                <div className="countdown-number">14</div>
                <div className="countdown-label">Days</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 60 }}>Why Join Troop 242?</h2>
          </motion.div>

          <motion.div
            className="grid grid--cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              { icon: Zap, title: 'Build Your Skills', desc: 'Master 145+ merit badges covering outdoor adventures, leadership, STEM, and more. Progress through 7 scout ranks with hands-on training.' },
              { icon: Award, title: 'Achieve Eagle Scout', desc: 'Earn the highest Boy Scout rank with our expert mentorship. Follow a proven pathway with 50+ active scouts and 80+ Eagle Scout alumni.' },
              { icon: Users, title: 'Join Our Brotherhood', desc: 'Connect with scouts your age, experienced leaders, and lifelong friends. Build bonds through weekly meetings, campouts, and community service.' }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                <item.icon size={48} style={{ color: '#00d68f', marginBottom: 16 }} />
                <h3 style={{ marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 60 }}>Upcoming Events</h2>
          </motion.div>

          <motion.div
            className="grid grid--cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {events.map((event, i) => {
              const countdown = countdowns[event.id];
              const formattedDate = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`event-card-flip ${event.featured ? 'featured' : ''}`}
                  style={{ height: 300 }}
                >
                  <div className="event-card-inner">
                    <div className="event-card-front" style={{ borderColor: event.featured ? '#00d68f' : 'rgba(0,214,143,0.2)' }}>
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(0,214,143,0.15)', color: '#00d68f', padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', fontWeight: 600 }}>
                          {event.type}
                        </span>
                      </div>

                          <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: 12 }}>{formattedDate} - ({event.day})</div>
                          <h3 style={{ marginTop: 0, marginBottom: 'auto' }}>{event.title}</h3>

                      {/* Countdown Timer - Synced Flip Animation */}
                      {countdown && (
                        <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: 'center' }}>
                          {/* Days - Flips every 24 hours (86400 seconds) */}
                          <motion.div
                            style={{ textAlign: 'center' }}
                            animate={{ rotateX: countdown.days % 24 === 0 ? [0, 360] : 0 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                          >
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00d68f', minWidth: '32px' }}>
                              {String(countdown.days).padStart(2, '0')}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Days</div>
                          </motion.div>

                          {/* Separator */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <div style={{ fontSize: '1.2rem', color: '#00d68f', fontWeight: 700 }}>:</div>
                          </div>

                          {/* Hours - Flips every 60 minutes */}
                          <motion.div
                            style={{ textAlign: 'center' }}
                            animate={{ rotateX: countdown.hours % 24 === 0 ? [0, 360] : 0 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                          >
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00d68f', minWidth: '32px' }}>
                              {String(countdown.hours).padStart(2, '0')}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Hrs</div>
                          </motion.div>

                          {/* Separator */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <div style={{ fontSize: '1.2rem', color: '#00d68f', fontWeight: 700 }}>:</div>
                          </div>

                          {/* Minutes - Flips every 60 seconds */}
                          <motion.div
                            style={{ textAlign: 'center' }}
                            animate={{ rotateX: countdown.minutes % 60 === 0 ? [0, 360] : 0 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                          >
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00d68f', minWidth: '32px' }}>
                              {String(countdown.minutes).padStart(2, '0')}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Min</div>
                          </motion.div>

                          {/* Separator */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                            <div style={{ fontSize: '1.2rem', color: '#00d68f', fontWeight: 700 }}>:</div>
                          </div>

                          {/* Seconds - Flips every 1 second */}
                          <div style={{ textAlign: 'center' }}>
                            <motion.div
                              key={countdown.seconds}
                              animate={{ rotateX: [0, 360] }}
                              transition={{ duration: 0.6, ease: 'easeInOut' }}
                              style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00d68f', minWidth: '32px' }}
                            >
                              {String(countdown.seconds).padStart(2, '0')}
                            </motion.div>
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>Sec</div>
                          </div>
                        </div>
                      )}

                    
                      <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: 16 }}>Click to learn more →</div>
                    </div>

                    <div className="event-card-back">
                      <div>
                        <h3 style={{ marginBottom: 20 }}>{event.title}</h3>
                        <div className="flex flex--col" style={{ gap: 12 }}>
                          <div className="flex" style={{ gap: 8 }}>
                            <Calendar size={16} style={{ color: '#00d68f', flexShrink: 0 }} />
                            <span>{formattedDate}</span>
                          </div>
                          <div className="flex" style={{ gap: 8 }}>
                            <Clock size={16} style={{ color: '#00d68f', flexShrink: 0 }} />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex" style={{ gap: 8, cursor: 'pointer' }} onClick={() => getDirections(event.location)}>
                            <MapPin size={16} style={{ color: '#00d68f', flexShrink: 0 }} />
                            <span style={{ textDecoration: 'underline' }}>{event.location}</span>
                          </div>
                        </div>

                        {/* Countdown on back */}
                        {countdown && (
                          <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,214,143,0.1)', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9rem', color: '#00d68f', fontWeight: 600 }}>
                              {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>until event</div>
                          </div>
                        )}

                        <button className="btn btn-primary" style={{ marginTop: 16, width: '100%' }}>Add to Calendar</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* RANK JOURNEY SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 60 }}>Your Path to Eagle Scout</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-100px' }}>
            <div className="rank-timeline" style={{ gap: 60, flexWrap: 'wrap' }}>
              {['Scout', 'Tenderfoot', '2nd Class', '1st Class', 'Star', 'Life', 'Eagle'].map((rank, i) => (
                <div key={i} className="flex flex--col" style={{ alignItems: 'center', gap: 12 }}>
                  <motion.div
                    className="rank-timeline__node"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => navigate('/ranks')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rank-timeline__emoji" style={{ fontSize: i === 7 ? '4.5rem' : '4rem' }}>
                      {['⚜️', '🎖️', '🗝️', '🛡️', '⭐', '✨', '🦅'][i]}
                    </div>
                    <div className="rank-timeline__name">{rank}</div>
                  </motion.div>
                  {i < 7 && <div className="rank-timeline__connector" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MERIT BADGES SECTION */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 60 }}>Explore Merit Badges</h2>
          </motion.div>

          <motion.div
            className="grid grid--cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              { emoji: '🏕️', title: 'Outdoor Skills', count: '15 badges' },
              { emoji: '🚣', title: 'Water Activities', count: '11 badges' },
              { emoji: '🧗', title: 'Climbing & Adventure', count: '9 badges' },
              { emoji: '💻', title: 'Technology & Innovation', count: '15 badges' },
              { emoji: '🎨', title: 'Arts & Crafts', count: '15 badges' },
              { emoji: '🔬', title: 'Science & Nature', count: '15 badges' },
              { emoji: '🤝', title: 'Community Service', count: '15 badges' },
              { emoji: '🦅', title: 'Eagle Required', count: '13 badges' }
            ].map((cat, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }} whileHover={{ scale: 1.05 }} onClick={() => navigate('/badges')}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>{cat.emoji}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{cat.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{cat.count}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} style={{ textAlign: 'center', marginTop: 60 }}>
            <motion.button
              className="btn btn-outline"
              whileHover={{ scale: 1.05, gap: 12 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/badges')}
            >
              View All 145+ Badges <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 60 }}>Get In Touch</h2>
          </motion.div>

          <motion.div
            className="grid grid--cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              { icon: Calendar, title: 'When', detail: 'Tuesdays at 7:00 PM', subtext: 'Year-round meetings', backDetail: null },
              { icon: MapPin, title: 'Where', detail: 'Sanford, FL', subtext: 'Central Florida location', backDetail: '3512 S Orlando Dr, Sanford, FL 32773' },
              { icon: Mail, title: 'Contact', detail: 'troop242sanford@gmail.com', subtext: 'Questions? Reach out!', backDetail: 'mailto:troop242sanford@gmail.com' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: 32, textAlign: 'center', cursor: item.backDetail ? 'pointer' : 'default', perspective: '1000px' }}
                onClick={() => item.backDetail && setFlipped({ ...flipped, [i]: !flipped[i] })}
              >
                <motion.div
                  animate={{ rotateY: flipped[i] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <item.icon size={48} style={{ color: '#00d68f', marginBottom: 16, margin: '0 auto 16px' }} />
                  <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: '1.1rem', marginBottom: 8, color: '#fff', fontWeight: 600 }}>{item.detail}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{item.subtext}</p>
                </motion.div>

                {item.backDetail && (
                  <motion.div
                    animate={{ rotateY: flipped[i] ? 0 : 180 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      backfaceVisibility: 'hidden',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 32
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ marginBottom: 16 }}>{item.title}</h3>
                      <p style={{ fontSize: '1rem', color: '#00d68f', fontWeight: 600, wordBreak: 'break-word' }}>
                        {item.backDetail.startsWith('mailto:') ? (
                          <a href={item.backDetail} style={{ color: '#00d68f', textDecoration: 'underline' }}>
                            {item.backDetail.replace('mailto:', '')}
                          </a>
                        ) : (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(item.backDetail);
                            }}
                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            {item.backDetail}
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} style={{ textAlign: 'center', marginTop: 60 }}>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
            >
              Send Us An Email
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
