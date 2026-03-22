import { Mail, MapPin, Phone, Clock, Send, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  { q: 'How much does it cost to join?', a: 'There is a BSA national membership fee (around $80/year) plus troop dues. Financial assistance is available — just ask a leader!' },
  { q: 'What night does the troop meet?', a: 'Troop 242 meets every Tuesday at 7:00 PM at 3512 S Orlando Dr, Sanford, FL 32773.' },
  { q: 'Does my child need a uniform to start?', a: 'No! Come to the first few meetings in regular clothes. Once you officially join, you will get the uniform.' },
  { q: 'Can my child join mid-year?', a: 'Absolutely. Scouts can join any time during the year — every Tuesday meeting is open to new members.' },
  { q: 'How much time does Scouting take?', a: 'Weekly Tuesday meetings (about 1.5 hours) plus roughly one campout per month. Merit badge work is done on your own schedule.' },
  { q: 'Is it safe?', a: 'Safety is a top priority. All adult leaders are background-checked and trained in BSA\'s Youth Protection program. Two registered adults are required at every Scout activity.' },
  { q: 'What is Eagle Scout?', a: 'Eagle Scout is the highest rank in Scouting. Only about 4% of Scouts earn it. It requires 21 merit badges, leadership positions, and a community service project.' },
  { q: 'What age can my child join?', a: 'Boys who have completed 5th grade or are 11 years old can join a Scout Troop. There is no upper age limit until age 18.' },
  { q: 'Do parents need to be involved?', a: 'Parent support is encouraged but not required at every meeting. Campouts may require a parent/guardian for younger Scouts. Adult volunteers are always welcome!' },
  { q: 'How do I officially sign up?', a: 'Send us an email using the form on this page, or just show up to a Tuesday meeting. We will walk you through the BSA membership paperwork on the spot.' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
      <section className="hero-page section" style={{}}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 24 }}>Contact Troop 242</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
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
                  <Mail size={24} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--text-primary)' }}>Email</h4>
                    <a href="mailto:troop242sanford@gmail.com" style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>
                      troop242sanford@gmail.com
                    </a>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                  <MapPin size={24} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--text-primary)' }}>Location</h4>
                    <p style={{ fontSize: '0.95rem', marginBottom: 4 }}>Sanford, FL</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Central Florida - meetings held locally
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                  <Clock size={24} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--text-primary)' }}>Meeting Times</h4>
                    <p style={{ fontSize: '0.95rem', marginBottom: 4 }}>Tuesdays at 7:00 PM</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Year-round meetings, all are welcome!
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card" style={{ padding: 28 }}>
                <div className="flex" style={{ gap: 16, alignItems: 'flex-start' }}>
                  <Phone size={24} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: 4, color: 'var(--text-primary)' }}>Scoutmaster</h4>
                    <p style={{ fontSize: '0.95rem', marginBottom: 4 }}>Available for questions</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
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
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 12,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-border)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
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
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 12,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-border)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
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
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 12,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-border)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
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
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: 12,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        minHeight: 120,
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-border)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
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
                style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}
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

      {/* FAQ SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Frequently Asked Questions</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 48px' }}>
              Common questions from new Scouts and parents.
            </p>
          </motion.div>

          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                viewport={{ once: true }}
                className="glass-card"
                style={{ overflow: 'hidden' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px 24px', background: 'transparent', border: 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                    fontSize: '1rem', fontWeight: 600, textAlign: 'left', gap: 16
                  }}
                >
                  {item.q}
                  <ChevronDown size={18} style={{ color: 'var(--accent)', flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
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
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32 }}>
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
