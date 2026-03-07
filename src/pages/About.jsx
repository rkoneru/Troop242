
import { Users, Zap, Award, Heart, Target, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
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
            <h1 style={{ marginBottom: 16 }}>⚜️ About Troop 242</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Building today's youth into tomorrow's leaders through adventure, brotherhood, and service
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 48 }}
          >
            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎯</div>
              <h3 style={{ marginBottom: 16 }}>Our Mission</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                To prepare young people to make ethical and moral choices through the values of the Scout Oath and Law, while developing leadership and outdoor skills that last a lifetime.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>💡</div>
              <h3 style={{ marginBottom: 16 }}>Our Vision</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                To be the premier scouting organization in Central Florida, known for developing engaged citizens, responsible leaders, and outdoor enthusiasts who contribute positively to their communities.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card" style={{ padding: 32 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>💚</div>
              <h3 style={{ marginBottom: 16 }}>Our Values</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Adventure, Brotherhood, Service. We believe in building scouts who are prepared for life's challenges, connected to their community, and committed to making the world a better place.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ marginBottom: 48 }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>What We Offer</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px' }}>
              Comprehensive scouting experiences that develop skills, character, and leadership
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}
            >
              {[
                { icon: Target, title: 'Rank Advancement', description: 'Clear pathway from Scout to Eagle Scout with achievable milestones and mentorship' },
                { icon: Award, title: '145+ Merit Badges', description: 'Diverse badge programs covering outdoor skills, technology, leadership, and more' },
                { icon: Zap, title: 'Regular Campouts', description: 'Monthly outdoor adventures with well-planned activities and experienced leadership' },
                { icon: Users, title: 'Leadership Development', description: 'Hands-on experience in leadership roles through patrol and troop positions' },
                { icon: Heart, title: 'Community Service', description: 'Meaningful service projects that make a real impact in Central Florida' },
                { icon: MapPin, title: 'Trip Opportunities', description: 'Annual trips including high-adventure camps, beach outings, and specialized skills training' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-card"
                  style={{ padding: 24 }}
                >
                  <item.icon size={32} style={{ color: 'var(--accent)', marginBottom: 12 }} />
                  <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Troop Leadership */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ marginBottom: 48 }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 40 }}>Troop Leadership</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              {[
                {
                  role: 'Scoutmaster',
                  name: 'Rich Lester',
                  experience: '20+ years in scouting',
                  bio: 'Dedicated to developing the next generation of leaders through outdoor skills and mentorship.'
                },
                {
                  role: 'Assistant Scoutmaster',
                  name: 'Mike',
                  experience: '15+ years in scouting',
                  bio: 'Passionate about creating inclusive experiences for all scouts and fostering outdoor adventures.'
                },
                {
                  role: 'Assistant Scoutmaster',
                  name: 'Mike',
                  experience: '12+ years in scouting',
                  bio: 'Focused on merit badge programs and helping scouts achieve their advancement goals.'
                },
                {
                  role: 'Advancement Chair',
                  name: 'Mike',
                  experience: '10+ years in scouting',
                  bio: 'Manages rank advancement and ensures scouts have clear paths to Eagle Scout.'
                },
                {
                  role: 'Treasurer',
                  name: 'Bridget Kroll',
                  experience: '8+ years in scouting',
                  bio: 'Oversees troop finances and ensures resources are available for programs and activities.'
                },
                {
                  role: 'Outdoor Activities Director',
                  name: 'Felicia Griffin',
                  experience: '14+ years in scouting',
                  bio: 'Plans and coordinates all campouts, hikes, and outdoor experiences for the troop.'
                }
              ].map((leader, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="glass-card"
                  style={{ padding: 24 }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00d68f 0%, #00a86b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: 16
                  }}>
                    👤
                  </div>

                  <h4 style={{ marginBottom: 4, color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    {leader.role}
                  </h4>
                  <h3 style={{ marginBottom: 8 }}>{leader.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 500 }}>
                    {leader.experience}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {leader.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats & Achievements */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Troop 242 by the Numbers</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              {[
                { number: '80+', label: 'Eagle Scout Alumni', icon: '🦅' },
                { number: '50+', label: 'Active Scouts', icon: '👥' },
                { number: '145+', label: 'Merit Badges Offered', icon: '🎖️' },
                { number: '20+', label: 'Years of Service', icon: '📅' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card"
                  style={{ padding: 32, textAlign: 'center' }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{stat.icon}</div>
                  <h3 style={{ color: 'var(--accent)', marginBottom: 8 }}>{stat.number}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Commitment to Values */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}
          >
            <h2 style={{ marginBottom: 24 }}>Our Commitment</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
              Every scout in Troop 242 receives the highest quality instruction and mentorship. We're committed to fostering an inclusive environment where all scouts can thrive, develop leadership skills, and achieve their scouting goals. Through outdoor adventures, skill development, and community service, we're building leaders who will make a positive impact on the world.
            </p>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Troop 242 Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
