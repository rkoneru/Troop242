import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Users, Zap, Award, MapPin, Clock, Mail, Heart, Shield, ChevronLeft } from 'lucide-react';
import CampfireIllustration from './troop242-campfire';
import { useState, useEffect, useMemo } from 'react';
import { SCOUTING_FACTS } from '../utils/facts';
import { DEFAULT_STATS, loadTroopData } from '../utils/adminData';
import { scrollToTop } from '../utils/scrollToTop';
import ScoutPath from './ScoutPath';

// Did You Know Carousel Component
function DidYouKnowCarousel() {
  const [currentFact, setCurrentFact] = useState(0);
  const facts = SCOUTING_FACTS;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [facts.length]);

  const nextFact = () => setCurrentFact((prev) => (prev + 1) % facts.length);
  const prevFact = () => setCurrentFact((prev) => (prev - 1 + facts.length) % facts.length);

  return (
    <section className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 60 }}>💡 Did You Know?</h2>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ padding: 48, textAlign: 'center', maxWidth: 900, margin: '0 auto' }}
        >
          {/* Fact Display */}
          <motion.p
            key={currentFact}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '1.3rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 32, minHeight: 80 }}
          >
            {facts[currentFact]}
          </motion.p>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
            <motion.button
              onClick={prevFact}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={20} />
            </motion.button>

            <motion.button
              onClick={nextFact}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                borderRadius: '50%',
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Counter */}
          <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>
            Fact {currentFact + 1} of {facts.length}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

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

// Flip Card Component
function WhyUsCard({ icon: Icon, title, desc }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="glass-card"
      style={{
        padding: 32,
        textAlign: 'center',
        cursor: 'pointer',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Front of card */}
      <motion.div
        animate={{ opacity: isFlipped ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: isFlipped ? 'absolute' : 'relative',
          pointerEvents: isFlipped ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Icon size={48} style={{ color: 'var(--accent)', marginBottom: 16 }} />
        <h3 style={{ marginBottom: 12 }}>{title}</h3>
      </motion.div>

      {/* Back of card */}
      <motion.div
        animate={{ opacity: isFlipped ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: isFlipped ? 'relative' : 'absolute',
          pointerEvents: isFlipped ? 'auto' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
      </motion.div>
    </motion.div>
  );
}

// Event Card Component with isolated countdown state
function EventCard({ event }) {
  const [countdown, setCountdown] = useState(null);
  const formattedDate = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = event.date - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event.date]);

  return (
    <motion.div
      variants={itemVariants}
      className={`event-card-flip ${event.featured ? 'featured' : ''}`}
      style={{ height: 300 }}
    >
      <div className="event-card-inner">
        <div className="event-card-front" style={{ borderColor: event.featured ? 'var(--accent)' : 'var(--accent-dim)' }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', background: 'var(--accent-dim)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', fontWeight: 600 }}>
              {event.type}
            </span>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>{formattedDate} - ({event.day})</div>
          <h3 style={{ marginTop: 0, marginBottom: 'auto', fontSize: '1.3rem' }}>
            <span style={{ marginRight: 8 }}>{event.icon}</span>
            {event.title}
          </h3>

          {/* Countdown Timer - Synced Flip Animation */}
          {countdown && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: 'center' }}>
              {/* Days - Flips every 24 hours */}
              <motion.div
                style={{ textAlign: 'center' }}
                animate={{ rotateX: countdown.days % 24 === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 ? [0, 360] : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '32px' }}>
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Days</div>
              </motion.div>

              {/* Separator */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 700 }}>:</div>
              </div>

              {/* Hours - Flips every 60 minutes */}
              <motion.div
                style={{ textAlign: 'center' }}
                animate={{ rotateX: countdown.hours % 24 === 0 && countdown.minutes === 0 && countdown.seconds === 0 ? [0, 360] : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '32px' }}>
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Hrs</div>
              </motion.div>

              {/* Separator */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 700 }}>:</div>
              </div>

              {/* Minutes - Flips every 60 seconds */}
              <motion.div
                style={{ textAlign: 'center' }}
                animate={{ rotateX: countdown.minutes % 60 === 0 && countdown.seconds === 0 ? [0, 360] : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '32px' }}>
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Min</div>
              </motion.div>

              {/* Separator */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 700 }}>:</div>
              </div>

              {/* Seconds - Flips every 1 second */}
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  key={countdown.seconds}
                  animate={{ rotateX: [0, 360] }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '32px' }}
                >
                  {String(countdown.seconds).padStart(2, '0')}
                </motion.div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Sec</div>
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 16 }}>Click to learn more →</div>
        </div>

        <div className="event-card-back">
          <div>
            <h3 style={{ marginBottom: 20 }}>{event.title}</h3>
            <div className="flex flex--col" style={{ gap: 12 }}>
              <div className="flex" style={{ gap: 8 }}>
                <Calendar size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex" style={{ gap: 8 }}>
                <Clock size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{event.time}</span>
              </div>
              <div className="flex" style={{ gap: 8 }}>
                <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Countdown on back */}
            {countdown && (
              <div style={{ marginTop: 16, padding: 12, background: 'var(--accent-dim)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>until event</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(DEFAULT_STATS);

  // Helper function to create dates - leaders enter actual month numbers (1-12)
  const createEventDate = (year, month, day, hour = 0, minute = 0) => {
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  };

  // Event data with dates
  const events = useMemo(() => {
    // Get next Tuesday at 7:00 PM EST
    const getNextTuesdayWithTime = () => {
      const today = new Date();
      let nextTuesday = new Date(today);
      const day = nextTuesday.getDay();
      const daysUntilTuesday = (2 - day + 7) % 7 || 7;
      nextTuesday.setDate(nextTuesday.getDate() + daysUntilTuesday);
      nextTuesday.setHours(19, 0, 0, 0);
      return nextTuesday;
    };

    return [
      { id: 'meeting1', date: getNextTuesdayWithTime(), day: 'Tuesday', type: 'Meeting', icon: '📍', title: 'Weekly Troop Meeting', time: '7:00 PM EST', location: '3512 S Orlando Dr, Sanford, FL 32773', recurring: 'Every Tuesday' },
      { id: 'campout', date: createEventDate(2026, 4, 24, 0, 0), day: 'Friday', type: 'Campout', icon: '🏕️', title: 'Spotlight on Pioneering', time: 'All Weekend', location: 'Palm Bluff Conservation Area SJRM, Osteen, FL', featured: true },
      { id: 'boardreview', date: createEventDate(2026, 3, 31, 18, 0), day: 'Tuesday', type: 'Board Review', icon: '📋', title: 'Board of Review', time: '6:00 PM EST', location: '3512 S Orlando Dr, Sanford, FL 32773' },
      { id: 'courtofhonor', date: createEventDate(2026, 6, 2, 19, 0), day: 'Tuesday', type: 'Court of Honor', icon: '👑', title: 'Court of Honor', time: '7:00 PM EST', location: '3512 S Orlando Dr, Sanford, FL 32773' ,featured: true}
    ];
  }, []);

  // Load stats from Firestore
  useEffect(() => {
    const loadStats = async () => {
      const loaded = await loadTroopData('stats', DEFAULT_STATS);
      setStats(loaded);
    };
    loadStats();
  }, []);


  return (
    <>
      {/* HERO SECTION with Campfire Background */}
      <section className="hero-v2 section" style={{ minHeight: '55vh', display: 'flex', alignItems:'inherit', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', opacity:1.5, inset: 0, zIndex: 0, width: '100%',  height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CampfireIllustration isHeroBackground={true} />
        </div>
        
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            className="flex flex--col flex--center"
            style={{ textAlign: 'center', gap: 24 }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Heading with Letter Reveal */}
            <motion.h1 className="text-shimmer" style={{ fontSize: 'clamp(2rem, 8vw, 5.5rem)', lineHeight: 1.2, wordWrap: 'break-word', maxWidth: '95vw' }}>
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
            <motion.p variants={itemVariants} style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: 'var(--text-muted)', maxWidth: '95vw', margin: '0 auto' }}>
              Adventure · Brotherhood · Eagle Scout Excellence
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex--center flex--wrap">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { navigate('/contact'); scrollToTop(); }}
              >
                Start Your Journey
              </motion.button>
              <motion.button
                className="btn btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { navigate('/about'); scrollToTop(); }}
              >
                Learn More
              </motion.button>
            </motion.div>

              {/* Stats Highlights */}
              {(() => {
                return (
                  <motion.div variants={itemVariants} className="grid grid--cols-3" style={{ gap: 70, maxWidth: 1000, margin: '0 auto', marginTop: 110 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div className="stat-counter">{stats.eagleScouts}</div>
                      <p style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'var(--text-muted)' }}>Eagle Scouts</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div className="stat-counter">{stats.yearsServing}</div>
                      <p style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'var(--text-muted)' }}>Years Strong</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div className="stat-counter">{stats.activeScouts}</div>
                      <p style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: 'var(--text-muted)' }}>Active Scouts</p>
                    </div>
                  </motion.div>
                );
              })()}
          </motion.div>
        </div>
      </section>

      {/* NEW SCOUT BANNER */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="glass-card"
            style={{
              padding: 48,
              background: 'linear-gradient(135deg, var(--accent-dim) 0%, transparent 100%)',
              border: '2px solid var(--accent-border)',
              textAlign: 'center'
            }}
          >
            <h2 style={{ marginBottom: 16, color: 'var(--accent)' }}>🎯 New Scout? Start Here</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
              Welcome to Troop 242! Our New Scout Guide will help you understand ranks, badges, and what to expect on your scouting journey.
            </p>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { navigate('/new-scout'); scrollToTop(); }}
            >
              Explore the New Scout Guide
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* WHY US SECTION */}
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
              { icon: Users, title: 'Brotherhood & Belonging', desc: 'More than a troop — a family. Weekly meetings, campouts, and service projects build lifelong friendships and mutual respect.' },
              { icon: Shield, title: `${stats.yearsServing} Years of Excellence`, desc: `Troop 242 has served Sanford, FL for ${stats.yearsServing}+ years under dedicated adult leaders and a strong charter organization.` },
              { icon: Heart, title: 'Community Service', desc: 'Give back to Sanford and Central Florida. Eagle projects, food drives, park cleanups, and more — scouts lead real change.' },
              { icon: Zap, title: '145+ Merit Badges', desc: 'Explore STEM, outdoor survival, leadership, arts, and more. Our experienced leaders guide you through every badge with hands-on sessions.' },
              { icon: Award, title: `${stats.eagleScouts} Eagle Scouts`, desc: `A proven track record — ${stats.eagleScouts} Eagle Scout alumni from Troop 242. Our mentorship program keeps you on the path from Scout to Eagle.` },
              { icon: MapPin, title: 'Florida Keys Adventures', desc: 'Annual spring campouts in the Florida Keys. Snorkeling, kayaking, fishing and wilderness camping with your troop brothers.' }
              
            ].map((item, i) => (
              <WhyUsCard key={i} icon={item.icon} title={item.title} desc={item.desc} />
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
            className="grid grid--cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {events.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
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
                    onClick={() => { navigate('/ranks'); scrollToTop(); }}
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
              <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }} whileHover={{ scale: 1.05 }} onClick={() => { navigate('/badges'); scrollToTop(); }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>{cat.emoji}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{cat.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cat.count}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} style={{ textAlign: 'center', marginTop: 60 }}>
            <motion.button
              className="btn btn-outline"
              whileHover={{ scale: 1.05, gap: 12 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { navigate('/badges'); scrollToTop(); }}
            >
              View All 145+ Badges <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* DID YOU KNOW CAROUSEL */}
      <DidYouKnowCarousel />

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
              { icon: Calendar, title: 'When', detail: 'Tuesdays at 7:00 PM', subtext: 'Year-round meetings' },
              { icon: MapPin, title: 'Where', detail: 'Sanford, FL', subtext: 'Central Florida location' },
              { icon: Mail, title: 'Contact', detail: 'troop242sanford@gmail.com', subtext: 'Questions? Reach out!' }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                <item.icon size={48} style={{ color: 'var(--accent)', marginBottom: 16, margin: '0 auto 16px' }} />
                <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--text-primary)', fontWeight: 600 }}>{item.detail}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.subtext}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} style={{ textAlign: 'center', marginTop: 60 }}>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { navigate('/contact'); scrollToTop(); }}
            >
              Send Us An Email
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
