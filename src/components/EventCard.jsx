import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

/**
 * EventCard component with isolated countdown timer to prevent parent re-renders.
 */
const EventCard = memo(({ event, itemVariants }) => {
  const [countdown, setCountdown] = useState(null);

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

  const formattedDate = event.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

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
              {/* Days */}
              <motion.div
                style={{ textAlign: 'center' }}
                animate={{ rotateX: countdown.days % 24 === 0 ? [0, 360] : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '32px' }}>
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Days</div>
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 700 }}>:</div>
              </div>

              {/* Hours */}
              <motion.div
                style={{ textAlign: 'center' }}
                animate={{ rotateX: countdown.hours % 24 === 0 ? [0, 360] : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '32px' }}>
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Hrs</div>
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 700 }}>:</div>
              </div>

              {/* Minutes */}
              <motion.div
                style={{ textAlign: 'center' }}
                animate={{ rotateX: countdown.minutes % 60 === 0 ? [0, 360] : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '32px' }}>
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Min</div>
              </motion.div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 700 }}>:</div>
              </div>

              {/* Seconds */}
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
});

EventCard.displayName = 'EventCard';

export default EventCard;
