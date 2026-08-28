
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const SCOUT_STORIES = [
  {
    rank: 'Eagle Scout',
    name: 'Marcus Johnson',
    story: 'Troop 242 has been the most transformative experience of my life. From learning essential outdoor skills to developing leadership abilities, this troop pushed me to become the best version of myself. The mentorship I received from our scoutmasters was invaluable, and I\'ll always cherish the friendships I\'ve made.',
    yearsInTroop: '7 years',
    quote: 'The journey to Eagle taught me that with dedication and support, anything is possible.'
  },
  {
    rank: 'Life Scout',
    name: 'Sarah Martinez',
    story: 'Being part of Troop 242 has given me confidence and new skills I never thought I\'d have. Our campouts are always well-organized and fun, and the older scouts are incredibly supportive. I\'m excited to complete my Eagle project and inspire other girls in scouting.',
    yearsInTroop: '5 years',
    quote: 'This troop made me realize I can do hard things.'
  },
  {
    rank: 'Star Scout',
    name: 'David Chen',
    story: 'Troop 242 offers more than just scouting—it\'s a community. The diversity of activities, from hiking to community service, has expanded my horizons. Our scoutmasters genuinely care about each scout\'s development, and that makes all the difference.',
    yearsInTroop: '3 years',
    quote: 'I came for the badges, but I stayed for the brotherhood.'
  },
  {
    rank: 'First Class Scout',
    name: 'Emma Rodriguez',
    story: 'Starting my scout journey in Troop 242 was the best decision. The curriculum is well-structured, progressing at a pace that keeps me challenged but not overwhelmed. I\'ve learned everything from knot-tying to leadership, and I love every minute of it.',
    yearsInTroop: '2 years',
    quote: 'Every meeting and campout teaches me something new about myself and scouting.'
  },
  {
    rank: 'Tenderfoot Scout',
    name: 'James Wilson',
    story: 'I\'m still new to Troop 242, but I can already see how amazing it is. Everyone has been so welcoming, and the skills we\'re learning are cool and practical. I\'m excited to see where this journey takes me!',
    yearsInTroop: '6 months',
    quote: 'Troop 242 feels like a second family.'
  },
  {
    rank: 'Eagle Scout',
    name: 'Christopher Lee',
    story: 'My experience in Troop 242 prepared me not just for Eagle Scout, but for life. The values of the Scout Oath and Law are deeply embedded in everything we do. Our leadership team consistently demonstrates what it means to be a good scout and a good person.',
    yearsInTroop: '8 years',
    quote: 'Scouting in Troop 242 shaped who I am today and who I want to be tomorrow.'
  }
];

const getRankColor = (rank) => {
  const colors = {
    'Eagle Scout': '#FFD700',
    'Life Scout': '#C0C0C0',
    'Star Scout': '#FF6B6B',
    'First Class Scout': '#4ECDC4',
    'Tenderfoot Scout': '#95E1D3'
  };
  return colors[rank] || '#00d68f';
};

export default function Stories() {
  const [expandedStory, setExpandedStory] = useState(null);

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
      <section className="hero-page section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>📖 Scout Stories & Feedback</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Hear from scouts at every level about their journey and experiences in Troop 242
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}
          >
            {SCOUT_STORIES.map((scout, idx) => (
              <motion.div
                key={scout.name}
                variants={itemVariants}
                className="glass-card"
                role="button"
                tabIndex={0}
                aria-expanded={expandedStory === idx}
                aria-controls={`story-detail-${idx}`}
                aria-label={`${expandedStory === idx ? 'Collapse' : 'Read'} story for ${scout.name}`}
                onClick={() => setExpandedStory(expandedStory === idx ? null : idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedStory(expandedStory === idx ? null : idx);
                  }
                }}
                style={{
                  padding: 24,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  borderTop: `3px solid ${getRankColor(scout.rank)}`
                }}
              >
                {/* Rank Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getRankColor(scout.rank)
                  }} />
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: getRankColor(scout.rank),
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {scout.rank}
                  </span>
                </div>

                {/* Scout Name */}
                <h3 style={{ marginBottom: 8, fontSize: '1.3rem' }}>{scout.name}</h3>

                {/* Years in Troop */}
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--accent)',
                  marginBottom: 16,
                  fontWeight: 600
                }}>
                  {scout.yearsInTroop} in Troop 242
                </p>

                {/* Quote */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: expandedStory === idx ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: expandedStory === idx ? 'none' : 'block'
                  }}
                >
                  <p style={{
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    color: 'var(--text-muted)',
                    marginBottom: 12,
                    borderLeft: `3px solid ${getRankColor(scout.rank)}`,
                    paddingLeft: 12
                  }}>
                    "{scout.quote}"
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>
                    <MessageCircle size={16} />
                    <span>Click to read full story</span>
                  </div>
                </motion.div>

                {/* Expanded Story */}
                <motion.div
                  id={`story-detail-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: expandedStory === idx ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: expandedStory === idx ? 'block' : 'none'
                  }}
                >
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.8,
                    marginBottom: 12
                  }}>
                    {scout.story}
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    color: 'var(--accent)',
                    paddingTop: 12,
                    borderTop: '1px solid var(--divider)'
                  }}>
                    "{scout.quote}"
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Stats */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Why Scouts Choose Troop 242</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {[
                { icon: '🌟', title: 'Mentorship', description: 'Experienced scoutmasters dedicated to your growth' },
                { icon: '🏕️', title: 'Adventures', description: 'Regular campouts, hikes, and outdoor experiences' },
                { icon: '👥', title: 'Community', description: 'Strong brotherhood and lasting friendships' },
                { icon: '🎖️', title: 'Achievement', description: '145+ merit badges and progression path to Eagle' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card"
                  style={{ padding: 24, textAlign: 'center' }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
