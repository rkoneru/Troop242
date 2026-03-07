
import { motion } from 'framer-motion';
import '../styles/calendar.css';

export default function Calendar() {
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
