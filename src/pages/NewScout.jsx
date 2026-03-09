import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, BookOpen, Users, Award, MapPin, Star, Lock } from 'lucide-react';
import { useState } from 'react';

const FIRST_30_DAYS = [
  { day: 'Day 1', title: 'Attend your first troop meeting', desc: 'Show up on Tuesday at 7:00 PM. Wear comfortable clothes — no uniform needed yet. Just introduce yourself and meet the patrol!' },
  { day: 'Week 1', title: 'Get your BSA membership', desc: 'Your parent/guardian will complete a BSA membership application. The troop committee will help you through this.' },
  { day: 'Week 2', title: 'Order your Scout uniform', desc: 'You will need: Scout shirt, Scout pants/shorts, belt, and a troop neckerchief. Leaders will tell you where to buy them.' },
  { day: 'Week 2', title: 'Learn the Scout Oath and Law', desc: 'Start memorizing the Scout Oath and the 12 points of the Scout Law. You will need these for your first rank (Scout rank).' },
  { day: 'Week 3', title: 'Complete Scout rank requirements', desc: 'The Scout rank is your first milestone. Requirements include knowing the Oath, Law, Motto, Slogan, and the Outdoor Code.' },
  { day: 'Week 4', title: 'Plan your first campout', desc: 'Ask your patrol leader about the next campout. Get your packing list ready. Your first campout is an unforgettable experience!' },
];

const WHAT_TO_BRING = [
  { event: 'First Meeting', items: ['Pen or pencil', 'Notebook', 'Water bottle', 'Good attitude!'] },
  { event: 'Campout', items: ['Sleeping bag', 'Tent (troop may provide)', 'Rain jacket', 'Hiking boots', 'Flashlight', 'Water bottle', 'Sunscreen', 'Bug spray', 'Change of clothes', 'Toiletries'] },
  { event: 'Day Hike', items: ['Water bottle (2L)', 'Snacks', 'Sunscreen', 'Hat', 'Comfortable shoes', 'First aid kit'] },
];

const GLOSSARY_PREVIEW = [
  { term: 'Blue Card', def: 'The official card used to track your progress on a merit badge. Your Scoutmaster signs it when you start.' },
  { term: 'Board of Review', def: 'A meeting with troop committee members where you discuss your scouting journey before advancing in rank.' },
  { term: 'Court of Honor', def: 'A ceremony where Scouts receive their rank patches, merit badges, and awards in front of their family.' },
  { term: 'Merit Badge Counselor', def: 'An adult expert who teaches you a merit badge and signs off when you complete all requirements.' },
  { term: 'Patrol', def: 'A small group of 6–8 Scouts within the troop. You will be assigned to a patrol when you join.' },
  { term: 'Scoutmaster', def: 'The adult leader of the troop. Think of them as your coach and mentor.' },
];

const PARENT_FAQ = [
  { q: 'How much does it cost to join?', a: 'There is a BSA national membership fee (around $80/year) plus a troop dues fee. Some troops offer financial assistance — just ask!' },
  { q: 'What night does the troop meet?', a: 'Troop 242 meets every Tuesday at 7:00 PM at 3512 S Orlando Dr, Sanford, FL 32773.' },
  { q: 'Does my child need a uniform to start?', a: 'No! Come to your first few meetings in regular clothes. Once you decide to join officially, then you will get the uniform.' },
  { q: 'Can my child join mid-year?', a: 'Absolutely. Scouts can join at any time during the year. There is no "start of season" — every Tuesday is a new opportunity.' },
  { q: 'How much time does it take?', a: 'Weekly Tuesday meetings (about 1.5 hours) plus roughly one campout per month. Badge work is done on your own schedule.' },
  { q: 'Is it safe?', a: 'Safety is a top priority. BSA has strict Youth Protection policies, and all adult leaders are trained and background-checked. Two-deep leadership is required at all events.' },
  { q: 'What is Eagle Scout?', a: 'Eagle Scout is the highest rank in Scouting. Only about 4% of Scouts earn it. It requires 21 merit badges, leadership positions, and a community service project.' },
  { q: 'How do I officially sign up?', a: 'Visit the Contact page and email us, or just show up to a Tuesday meeting. We will walk you and your parent through the paperwork.' },
];

export default function NewScout() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [checkedDays, setCheckedDays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('newScoutChecklist') || '{}');
    } catch {
      return {};
    }
  });
  const [selectedEvent, setSelectedEvent] = useState(0);

  const toggleCheck = (i) => {
    setCheckedDays(prev => {
      const updated = { ...prev, [i]: !prev[i] };
      localStorage.setItem('newScoutChecklist', JSON.stringify(updated));
      return updated;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-v2 section" style={{ minHeight: '55vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>⚜️</div>
            <h1 style={{ marginBottom: 16 }}>Welcome, New Scout!</h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: 650, margin: '0 auto 32px' }}>
              Everything you need to know to get started with Troop 242. From your first meeting to your first campout — we have got you covered.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button className="btn btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/contact')}>
                Join Troop 242 <ChevronRight size={18} />
              </motion.button>
              <motion.button className="btn btn-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/ranks')}>
                See All Ranks
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <h2 style={{ marginBottom: 10 }}>Start Learning from Left to Right</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '1000px', margin: '0 auto' }}>
              Explore these essential topics to understand Scouting and your journey to Eagle
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}
          >
            {[
              { icon: BookOpen, label: 'Scout Principles', sub: 'Oath, Law & Code', path: '/scout-principles' },
              { icon: Award, label: 'Ranks', sub: 'Scout to Eagle', path: '/ranks' },
              { icon: Star, label: 'Merit Badges', sub: '140+ badges to earn', path: '/badges' },
              { icon: Users, label: 'About Troop 242', sub: 'Meet your leaders', path: '/about' },
              { icon: MapPin, label: 'Calendar', sub: 'Upcoming events', path: '/calendar' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}
                whileHover={{ scale: 1.04 }}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={32} style={{ color: 'var(--accent)', marginBottom: 10 }} />
                <h4 style={{ marginBottom: 4 }}>{item.label}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* YOUR FIRST 30 DAYS */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Your First 30 Days</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
              Check off each step as you complete it. Your progress is saved automatically.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {FIRST_30_DAYS.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  opacity: checkedDays[i] ? 0.6 : 1,
                  transition: 'opacity 0.3s'
                }}
                onClick={() => toggleCheck(i)}
              >
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  <CheckCircle2
                    size={24}
                    style={{ color: checkedDays[i] ? 'var(--accent)' : 'var(--accent-dim)', transition: 'color 0.3s' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {step.day}
                  </span>
                  <h4 style={{ margin: '4px 0 8px', textDecoration: checkedDays[i] ? 'line-through' : 'none' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT TO BRING */}
      <section className="section section--dark">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 48 }}>What to Bring</h2>
          </motion.div>

          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Event Tabs */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              {WHAT_TO_BRING.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedEvent(i)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 30,
                    border: '1px solid',
                    borderColor: selectedEvent === i ? 'var(--accent)' : 'var(--divider)',
                    background: selectedEvent === i ? 'var(--accent-dim)' : 'transparent',
                    color: selectedEvent === i ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  {item.event}
                </button>
              ))}
            </div>

            <motion.div
              key={selectedEvent}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{ padding: 32 }}
            >
              <h3 style={{ marginBottom: 20 }}>Packing List: {WHAT_TO_BRING[selectedEvent].event}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {WHAT_TO_BRING[selectedEvent].items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW RANKS WORK */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>How Ranks Work</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 48px' }}>
              Scouting has 7 ranks. You start at Scout and work your way up to Eagle Scout. Each rank has specific requirements you complete at your own pace.
            </p>
          </motion.div>

          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
              {[
                { emoji: '⚜️', name: 'Scout', time: 'Start here' },
                { emoji: '🎖️', name: 'Tenderfoot', time: '~4 months' },
                { emoji: '🗝️', name: '2nd Class', time: '~6 months' },
                { emoji: '🛡️', name: '1st Class', time: '~8 months' },
                { emoji: '⭐', name: 'Star', time: '~6 months' },
                { emoji: '✨', name: 'Life', time: '~6 months' },
                { emoji: '🦅', name: 'Eagle', time: 'The goal!' },
              ].map((rank, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  style={{ textAlign: 'center', minWidth: 80 }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>{rank.emoji}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rank.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{rank.time}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ padding: 28, textAlign: 'center' }}
            >
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 20 }}>
                Each rank requires completing specific requirements: learning skills, doing service hours, holding leadership roles, and earning merit badges. A Board of Review with troop committee members marks each rank advancement.
              </p>
              <motion.button className="btn btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/ranks')}>
                See Full Rank Details <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* KEY TERMS */}
      <section className="section section--dark">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Key Terms to Know</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 48px' }}>
              Scouting has its own vocabulary. Here are the most important terms for new Scouts.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}
          >
            {GLOSSARY_PREVIEW.map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>{item.term}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{item.def}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: 32 }}
          >
            <motion.button className="btn btn-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/glossary')}>
              Full Glossary <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* PARENT FAQ */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Parent FAQ</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 48px' }}>
              Common questions from parents of new Scouts.
            </p>
          </motion.div>

          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PARENT_FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass-card"
                style={{ overflow: 'hidden' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    gap: 16
                  }}
                >
                  {item.q}
                  <ChevronRight
                    size={18}
                    style={{
                      color: 'var(--accent)',
                      flexShrink: 0,
                      transition: 'transform 0.3s',
                      transform: openFaq === i ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ padding: '0 24px 20px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>
                    {item.a}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* TRACK YOUR PROGRESS BANNER */}
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="glass-card"
              style={{ padding: 40, maxWidth: 700, margin: '0 auto', textAlign: 'center', border: '1px solid var(--accent-border)' }}
            >
              <Lock size={40} style={{ color: 'var(--accent)', marginBottom: 16 }} />
              <h3 style={{ marginBottom: 12 }}>Track Your Progress</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
                Log in to save your rank checklist, skill progress, and badge wishlist — and pick up where you left off.
              </p>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/member-login')}
              >
                Log In & Track Progress
              </motion.button>
            </motion.div>
          </div>
        </section>  

      {/* READY TO JOIN CTA */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🦅</div>
            <h2 style={{ marginBottom: 16 }}>Ready to Start Your Journey?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32 }}>
              Come to any Tuesday meeting at 7:00 PM. No experience needed — just show up!
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button className="btn btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/contact')}>
                Contact Us <ChevronRight size={18} />
              </motion.button>
              <motion.button className="btn btn-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/calendar')}>
                See Next Meeting
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
