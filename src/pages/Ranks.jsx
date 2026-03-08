
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RANKS = [
  {
    name: 'Scout',
    emoji: '⚜️',
    requirements: ['Join a Troop', 'Understand Scout Oath & Law', 'Learn Scout Skills'],
    benefits: ['Handbook', 'Uniform', 'Community'],
    url: 'https://www.scouting.org/advancement/boy-scouts/scout/'
  },
  {
    name: 'Tenderfoot',
    emoji: '🎖️',
    requirements: ['2 Months in Troop', 'Camping Skills', 'Cooking & Fire Safety', 'Knot Tying'],
    benefits: ['First Advancement', 'Outdoor Skills', 'Leadership Start'],
    url: 'https://www.scouting.org/advancement/boy-scouts/tenderfoot/'
  },
  {
    name: '2nd Class',
    emoji: '🗝️',
    requirements: ['3 Months Service', 'Navigation Skills', 'First Aid', 'Outdoor Survival'],
    benefits: ['Leadership Roles', 'Advanced Skills', 'Camping Experience'],
    url: 'https://www.scouting.org/advancement/boy-scouts/second-class/'
  },
  {
    name: '1st Class',
    emoji: '🛡️',
    requirements: ['6 Months Since Last', 'Leadership Experience', 'Communication', 'Swimming/Hiking'],
    benefits: ['Scout Leadership', 'Higher Responsibilities', 'Role Modeling'],
    url: 'https://www.scouting.org/advancement/boy-scouts/first-class/'
  },
  {
    name: 'Star',
    emoji: '⭐',
    requirements: ['4 Months Service', '5 Merit Badges', 'Project Leadership', 'Service Hours'],
    benefits: ['Council Recognition', 'Advanced Badges', 'Peer Mentoring'],
    url: 'https://www.scouting.org/advancement/boy-scouts/star/'
  },
  {
    name: 'Life',
    emoji: '✨',
    requirements: ['4 Months Service', '8 Merit Badges', 'Significant Project', 'Community Impact'],
    benefits: ['High Recognition', 'Eagle Preparation', 'Mentorship Role'],
    url: 'https://www.scouting.org/advancement/boy-scouts/life/'
  },
  {
    name: 'Eagle',
    emoji: '🦅',
    requirements: ['Eagle Project', '21 Merit Badges', 'Life Skills Mastery', 'Character Excellence'],
    benefits: ['Highest Honor', 'Lifelong Achievement', 'Leadership Legacy'],
    url: 'https://www.scouting.org/advancement/boy-scouts/eagle-scout/'
  }
];

export default function Ranks() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-page section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 24 }}>Scout Ranks</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
              Progress through seven ranks from Scout to Eagle Scout. Each rank represents growth in leadership, outdoor skills, and character development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* RANKS GRID */}
      <section className="section">
        <div className="container">
          <motion.div
            className="grid grid--cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ gap: 32 }}
          >
            {RANKS.map((rank, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: 32 }}
              >
                {/* Rank Header */}
                <div className="flex" style={{ alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: '3.5rem', flexShrink: 0 }}>{rank.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>{rank.name}</h2>
                    <p style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>Rank #{i + 1}</p>
                  </div>
                </div>

                {/* Requirements */}
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>Requirements</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {rank.requirements.map((req, j) => (
                      <div key={j} style={{ fontSize: '0.95rem' }}>• {req}</div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 20 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>Benefits</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {rank.benefits.map((benefit, j) => (
                      <div key={j} style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>• {benefit}</div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.a
                  href={rank.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 24, display: 'inline-flex', justifyContent: 'center' }}
                  whileHover={{ scale: 1.05, gap: 12 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More <ArrowRight size={16} />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROGRESSION SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2>Your Journey to Eagle</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16, marginBottom: 40 }}>
                {RANKS.map((rank, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: '2.5rem' }}>{rank.emoji}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rank.name}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 16 }}>Time to Eagle: 4-5 Years</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                Most scouts reach Eagle rank within 4-5 years of dedication, consistent attendance, and personal growth. The average age for Eagle Scout is 16.
              </p>
              <motion.a
                href="https://www.scouting.org/advancement/boy-scouts/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn About All Ranks
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
