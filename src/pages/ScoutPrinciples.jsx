import { motion } from 'framer-motion';
import { Heart, Scale, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const SCOUT_LAW_TERMS = [
  { term: 'Trustworthy', definition: 'A Scout is worthy of trust. You are honest and sincere in your dealings.' },
  { term: 'Loyal', definition: 'A Scout is true to family, friends, Scout leaders, school, and country.' },
  { term: 'Helpful', definition: 'A Scout is concerned about other people. You willingly volunteer to help others.' },
  { term: 'Friendly', definition: 'A Scout is a friend to all. You are kind to people regardless of their differences.' },
  { term: 'Courteous', definition: 'A Scout is polite. You treat others with respect and show good manners.' },
  { term: 'Kind', definition: 'A Scout is considerate. You are thoughtful of others\' feelings and show compassion.' },
  { term: 'Obedient', definition: 'A Scout follows the rules of family, school, and Scout troop. You follow the leader.' },
  { term: 'Cheerful', definition: 'A Scout smiles. You look for the bright side of life and eagerly face challenges.' },
  { term: 'Thrifty', definition: 'A Scout is careful with money and property. You waste nothing and respect resources.' },
  { term: 'Brave', definition: 'A Scout faces challenges with courage. You stand up for what is right.' },
  { term: 'Clean', definition: 'A Scout keeps body and mind fit and clean. You respect nature and others.' },
  { term: 'Reverent', definition: 'A Scout respects all beliefs. You are faithful in your own convictions and respect others\'.' }
];

export default function ScoutPrinciples() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-v2 section" style={{ minHeight: '55vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 24 }}>Scout Principles</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 700, margin: '0 auto' }}>
              The foundation of Scouting: the Scout Oath, Scout Law, and Outdoor Code guide every Scout's behavior and values.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SCOUT OATH SECTION */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 48, marginBottom: 60 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Heart size={40} style={{ color: 'var(--accent)' }} />
                <h2 style={{ margin: 0 }}>The Scout Oath</h2>
              </div>

              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 32 }}>
                "On my honor, I will do my best to do my duty to God and my country and to obey the Scout Law; to help other people at all times; to keep myself physically strong, mentally awake, and morally straight."
              </p>

              <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 24 }}>
                <h3 style={{ marginTop: 0, marginBottom: 16 }}>Understanding the Oath</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                  <div>
                    <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>On My Honor</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      A promise to be truthful, honest, and to act with integrity in all things.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>Duty to God & Country</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Respecting your faith and serving your country with pride and patriotism.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>Obey the Scout Law</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Following the twelve points of the Scout Law in your daily life.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>Help Other People</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Being of service to others and contributing to your community.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>Physically Strong</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Maintaining your health through exercise, nutrition, and outdoor activities.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--accent)', marginBottom: 8 }}>Morally Straight</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Living with strong moral values and making ethical choices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCOUT LAW SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 48, marginBottom: 60 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Scale size={40} style={{ color: 'var(--accent)' }} />
                <h2 style={{ margin: 0 }}>The Scout Law</h2>
              </div>

              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 32 }}>
                "A Scout is trustworthy, loyal, helpful, friendly, courteous, kind, obedient, cheerful, thrifty, brave, clean, and reverent."
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>1. Trustworthy</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout is worthy of trust. You are honest and sincere in your dealings.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>2. Loyal</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout is true to family, friends, Scout leaders, school, and country.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>3. Helpful</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout is concerned about other people. You willingly volunteer to help others.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>4. Friendly</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout is a friend to all. You are kind to people regardless of their differences.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>5. Courteous</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout is polite. You treat others with respect and show good manners.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>6. Kind</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout is considerate. You are thoughtful of others' feelings and show compassion.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>7. Obedient</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout follows the rules of family, school, and Scout troop. You follow the leader.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>8. Cheerful</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout smiles. You look for the bright side of life and eagerly face challenges.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>9. Thrifty</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout is careful with money and property. You waste nothing and respect resources.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>10. Brave</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout faces challenges with courage. You stand up for what is right.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>11. Clean</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout keeps body and mind fit and clean. You respect nature and others.
                  </p>
                </div>

                <div style={{ padding: 20, background: 'var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 8px 0' }}>12. Reverent</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    A Scout respects all beliefs. You are faithful in your own convictions and respect others'.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUTDOOR CODE SECTION */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <Leaf size={40} style={{ color: 'var(--accent)' }} />
                <h2 style={{ margin: 0 }}>The Outdoor Code</h2>
              </div>

              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 32 }}>
                "As an outdoor enthusiast, I know that I am responsible for the care of the environment. As a Scout, I will do my best to be an environmental steward."
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <div style={{ padding: 24, border: '2px solid var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 12px 0', fontSize: '1.1rem' }}>Treat the Outdoors Carefully</h4>
                  <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                    <li>Respect nature and all living things</li>
                    <li>Leave no trace of your visit</li>
                    <li>Protect wildlife and habitats</li>
                    <li>Keep water clean and unpolluted</li>
                  </ul>
                </div>

                <div style={{ padding: 24, border: '2px solid var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 12px 0', fontSize: '1.1rem' }}>Discover the Outdoors Responsibly</h4>
                  <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                    <li>Learn about nature and the environment</li>
                    <li>Follow established trails and rules</li>
                    <li>Camp in designated areas</li>
                    <li>Travel safely and responsibly</li>
                  </ul>
                </div>

                <div style={{ padding: 24, border: '2px solid var(--accent-dim)', borderRadius: 12 }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 12px 0', fontSize: '1.1rem' }}>Share the Outdoors With Others</h4>
                  <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                    <li>Be considerate to other outdoor users</li>
                    <li>Invite others to enjoy nature</li>
                    <li>Educate others about conservation</li>
                    <li>Support environmental protection efforts</li>
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: 32, padding: 24, background: 'var(--accent-dim)', borderRadius: 12 }}>
                <h3 style={{ color: 'var(--accent)', marginTop: 0, marginBottom: 16 }}>Leave No Trace Principles</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  The Outdoor Code emphasizes leaving no trace—the practice of minimizing your impact on the environment. Whether camping, hiking, or exploring, Scouts should always clean up after themselves, stay on established trails, pack out all trash, and respect wildlife by observing from a distance. By following the Outdoor Code, Scouts become stewards of the environment and ensure that nature remains pristine for future generations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FLASHCARD QUIZ SECTION */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Scout Law Flashcards</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32 }}>
              Test yourself on the 12 Scout Law values. Click the card to flip and reveal the definition.
            </p>

            {/* Flashcard */}
            <motion.div
              style={{
                width: '100%',
                height: '280px',
                cursor: 'pointer',
                perspective: '1000px',
                marginBottom: 32
              }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Front */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
                    borderRadius: 16,
                    padding: 40,
                    textAlign: 'center'
                  }}
                >
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: '0 0 16px 0' }}>
                      Scout Law #{currentCardIndex + 1}
                    </p>
                    <h2 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '2.5rem' }}>
                      {SCOUT_LAW_TERMS[currentCardIndex].term}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      Click to reveal definition
                    </p>
                  </div>
                </div>

                {/* Back */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(16, 185, 129, 0.2) 100%)',
                    borderRadius: 16,
                    padding: 40,
                    border: '2px solid var(--accent)',
                    textAlign: 'center'
                  }}
                >
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
                    {SCOUT_LAW_TERMS[currentCardIndex].definition}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <motion.button
                onClick={() => setCurrentCardIndex((currentCardIndex - 1 + SCOUT_LAW_TERMS.length) % SCOUT_LAW_TERMS.length)}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={16} /> Previous
              </motion.button>

              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                  Card {currentCardIndex + 1} of {SCOUT_LAW_TERMS.length}
                </p>
              </div>

              <motion.button
                onClick={() => setCurrentCardIndex((currentCardIndex + 1) % SCOUT_LAW_TERMS.length)}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
