
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email
    const mailtoLink = `mailto:troop242sanford@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

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
      <section className="section section--dark" style={{ paddingTop: 120, minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 24 }}>Contact Troop 242</h1>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', maxWidth: 600, margin: '0 auto' }}>
              Have questions about joining Troop 242? Want to know more about our programs? Reach out to us today!
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO & FORM */}
      <section className="section">
        <div className="container">
          <div className="grid grid--cols-2" style={{ gap: 40, maxWidth: 1100, margin: '0 auto' }}>
            {/* Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <h2 style={{ marginBottom: 40 }}>Get In Touch</h2>

              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                  <Mail size={24} style={{ color: '#00d68f', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Email</h4>
                    <a href="mailto:troop242sanford@gmail.com" style={{ color: '#00d68f', fontSize: '0.95rem' }}>
                      troop242sanford@gmail.com
                    </a>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: 8 }}>
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                  <MapPin size={24} style={{ color: '#00d68f', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Location</h4>
                    <p style={{ fontSize: '0.95rem', marginBottom: 4 }}>Sanford, FL</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      Central Florida - meetings held locally
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                  <Clock size={24} style={{ color: '#00d68f', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Meeting Times</h4>
                    <p style={{ fontSize: '0.95rem', marginBottom: 4 }}>Tuesdays at 7:00 PM</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      Year-round meetings, all are welcome!
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28 }}>
                <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                  <Phone size={24} style={{ color: '#00d68f', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4 }}>Scoutmaster</h4>
                    <p style={{ fontSize: '0.95rem', marginBottom: 4 }}>Available for questions</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      Contact via email for phone number
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 style={{ marginBottom: 40 }}>Send us a Message</h2>

              <form onSubmit={handleSubmit}>
                <div className="glass-card" style={{ padding: 32 }}>
                  {/* Name Field */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.95rem', fontWeight: 600 }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        color: '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 214, 143, 0.5)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 214, 143, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Email Field */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.95rem', fontWeight: 600 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        color: '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 214, 143, 0.5)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 214, 143, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Subject Field */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.95rem', fontWeight: 600 }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        color: '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 214, 143, 0.5)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 214, 143, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Message Field */}
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.95rem', fontWeight: 600 }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message here..."
                      required
                      rows="5"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        color: '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        minHeight: 120,
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 214, 143, 0.5)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 214, 143, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={18} />
                    {submitted ? 'Message Sent!' : 'Send Message'}
                  </motion.button>
                </div>
              </form>

              <motion.p
                style={{ marginTop: 16, color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {submitted ? 'Thank you! Your email client is opening...' : "We'll get back to you as soon as possible"}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}
          >
            <h2 style={{ marginBottom: 24 }}>Ready to Join Troop 242?</h2>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', marginBottom: 32 }}>
              Come visit us at our next meeting and discover the adventure that awaits. No experience necessary!
            </p>
            <motion.button
              className="btn btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('[name="message"]')?.focus()}
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
