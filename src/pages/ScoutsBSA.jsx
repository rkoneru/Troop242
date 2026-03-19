import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Users, Award, Target, Heart, MapPin } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';

export default function ScoutsBSA() {
  const navigate = useNavigate();

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
      <section className="hero-page section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>📖 What is Scouts BSA?</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
              Understanding the program, values, and opportunities in Scouts BSA
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROGRAM OVERVIEW */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="glass-card"
            style={{ padding: 48, marginBottom: 60 }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 32, color: 'var(--accent)' }}>Program Overview</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 24, color: 'var(--text-primary)' }}>
              <strong>Scouts BSA</strong> is the program in Scouting America for boys and girls aged 11-17 years.
              It is one of the oldest youth organizations in the United States, where young people can participate in various outdoor activities
              like camping, hiking, kayaking, mountain biking, and much more!
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
              Scouts BSA focuses on developing well-rounded young people through outdoor adventures, skill-building, leadership opportunities,
              and community service. Whether you're interested in outdoor survival, technology, arts, or leadership—there's something for everyone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ marginBottom: 48 }}>Our Four Core Pillars</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}
            >
              {[
                {
                  emoji: '🎓',
                  title: 'Character Development',
                  desc: 'Building ethical and moral foundations. Scouts learn to make good choices and stand up for what is right. Through the Scout Oath and Law, we develop integrity, honesty, and responsibility.'
                },
                {
                  emoji: '🇺🇸',
                  title: 'Citizenship Training',
                  desc: 'Becoming responsible community members. Scouts participate in community service projects, learn about civic duty, and understand the importance of giving back to their communities.'
                },
                {
                  emoji: '👨‍💼',
                  title: 'Leadership',
                  desc: 'Developing skills to lead others. Every Scout holds leadership positions within their patrol and troop. We teach decision-making, teamwork, and how to inspire others.'
                },
                {
                  emoji: '💪',
                  title: 'Mental & Physical Fitness',
                  desc: 'Healthy mind and body. Through outdoor activities, camping, hiking, and sports, Scouts develop physical strength while also building mental resilience and emotional intelligence.'
                }
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-card"
                  style={{ padding: 32, textAlign: 'center' }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>{pillar.emoji}</div>
                  <h3 style={{ color: 'var(--accent)', marginBottom: 12 }}>{pillar.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{pillar.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SCOUT ACTIVITIES */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ marginBottom: 24 }}>What Do Scouts Do?</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>
              Scouts BSA offers diverse activities and experiences. Here are the main areas where Scouts develop skills and have fun:
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}
          >
            {[
              { emoji: '🏕️', activity: 'Camping', desc: 'Build fires, pitch tents, cook outdoors' },
              { emoji: '🥾', activity: 'Hiking', desc: 'Explore trails and nature' },
              { emoji: '🎯', activity: 'Exploring Hobbies', desc: 'Discover new interests and passions' },
              { emoji: '🎒', activity: 'Backpacking', desc: 'Multi-day wilderness trips' },
              { emoji: '🛶', activity: 'Canoeing', desc: 'Navigate waters and rapids' },
              { emoji: '💼', activity: 'Career Exploration', desc: 'Learn about different professions' },
              { emoji: '🔥', activity: 'Outdoor Cooking', desc: 'Master campfire cuisine' },
              { emoji: '🚴', activity: 'Mountain Biking', desc: 'Off-road cycling adventures' },
              { emoji: '🤝', activity: 'Community Service', desc: 'Give back to your community' },
              { emoji: '🚣', activity: 'Kayaking', desc: 'Paddle and explore water' },
              { emoji: '⚙️', activity: 'STEM', desc: 'Technology and engineering projects' },
              { emoji: '🧗', activity: 'Climbing', desc: 'Rock climbing and rappelling' },
              { emoji: '🏊', activity: 'Swimming', desc: 'Water safety and skills' },
              { emoji: '👨‍💼', activity: 'Leadership Roles', desc: 'Lead your patrol and troop' },
              { emoji: '🦅', activity: 'Earning Eagle Scout', desc: 'The highest achievement' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: 24, textAlign: 'center' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{item.emoji}</div>
                <h4 style={{ marginBottom: 8, color: 'var(--accent)' }}>{item.activity}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ORGANIZED EVENTS & OPPORTUNITIES */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ marginBottom: 24 }}>Organized Events & Opportunities</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
              Beyond weekly meetings and campouts, Scouts participate in special events that create lasting memories
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}
          >
            {[
              {
                icon: '🏕️',
                title: 'Summer Camp',
                desc: 'A week-long adventure with hundreds of Scouts. Learn advanced skills, earn merit badges, and make friends from other troops.'
              },
              {
                icon: '🌍',
                title: 'National & World Jamborees',
                desc: 'Attend massive gatherings of thousands of Scouts. Experience international culture and competition at the highest level.'
              },
              {
                icon: '🤝',
                title: 'Community Service Projects',
                desc: 'Make a real impact on your community. Clean parks, build trails, help the homeless, and earn Eagle project requirements.'
              },
              {
                icon: '🏆',
                title: 'Competitions & Awards',
                desc: 'Compete in merit badge contests, outdoor skills competitions, and earn recognition for your accomplishments.'
              },
              {
                icon: '🎒',
                title: 'High-Adventure Trips',
                desc: 'Take on challenging expeditions like backpacking, rock climbing, kayaking, and wilderness survival courses.'
              },
              {
                icon: '📚',
                title: 'Merit Badge Programs',
                desc: 'Earn over 140 badges across outdoor skills, STEM, arts, and leadership. Build a well-rounded resume.'
              }
            ].map((event, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: 32 }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{event.icon}</div>
                <h3 style={{ color: 'var(--accent)', marginBottom: 12 }}>{event.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{event.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* THE SCOUT OATH & LAW */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ marginBottom: 24 }}>The Scout Oath & Law</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
              These principles guide everything we do in Scouts BSA
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}
          >
            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 40, background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(0, 214, 143, 0.05) 100%)' }}
            >
              <h3 style={{ color: 'var(--accent)', marginBottom: 24, textAlign: 'center' }}>The Scout Oath</h3>
              <p style={{ lineHeight: 2, color: 'var(--text-primary)', fontSize: '0.95rem', textAlign: 'center', margin: 0 }}>
                On my honor, I will do my best to do my duty to God and my country and to obey the Scout Law; to help other people at all times;
                to keep myself physically strong, mentally awake, and morally straight.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass-card"
              style={{ padding: 40, background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(0, 214, 143, 0.05) 100%)' }}
            >
              <h3 style={{ color: 'var(--accent)', marginBottom: 24, textAlign: 'center' }}>The Scout Law</h3>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Trustworthy', 'Loyal', 'Helpful', 'Friendly',
                  'Courteous', 'Kind', 'Obedient', 'Cheerful',
                  'Thrifty', 'Brave', 'Clean', 'Reverent'
                ].map((value, i) => (
                  <li key={i} style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>✓</span> {value}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY JOIN SCOUTS BSA */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ marginBottom: 24 }}>Why Join Scouts BSA?</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}
          >
            {[
              { icon: Target, title: 'Build Skills for Life', desc: 'Learn practical outdoor, leadership, and technical skills that will serve you for a lifetime.' },
              { icon: Users, title: 'Make Lifelong Friends', desc: 'Build strong friendships with peers who share your values and interests.' },
              { icon: Award, title: 'Achieve Your Goals', desc: 'Work toward meaningful achievements like merit badges and the prestigious Eagle Scout rank.' },
              { icon: Heart, title: 'Serve Your Community', desc: 'Make a real difference through community service and leadership projects.' },
              { icon: Zap, title: 'Adventure & Excitement', desc: 'Experience thrilling outdoor adventures from camping to rock climbing and kayaking.' },
              { icon: MapPin, title: 'Explore the World', desc: 'Travel to summer camps, jamborees, and high-adventure destinations.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: 28 }}
              >
                <item.icon size={36} style={{ color: 'var(--accent)', marginBottom: 16 }} />
                <h3 style={{ color: 'var(--accent)', marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="glass-card"
            style={{
              padding: 48,
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(0, 214, 143, 0.05) 100%)',
              border: '2px solid var(--accent-border)'
            }}
          >
            <h2 style={{ marginBottom: 24 }}>Ready to Begin Your Scouting Journey?</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>
              Whether you're 11 or 17, there's a place for you in Scouts BSA. Join Troop 242 and discover what it means to be a Scout.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { navigate('/contact'); scrollToTop(); }}
              >
                Join Troop 242 <ChevronRight size={18} style={{ marginLeft: 8 }} />
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { navigate('/new-scout'); scrollToTop(); }} 
              >
                New Scout Guide
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}