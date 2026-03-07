
import { Search, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const SKILL_CATEGORIES = [
  {
    category: 'Outdoor Survival',
    emoji: '🔥',
    description: 'Master essential survival and outdoor skills',
    skills: [
      'Fire Building & Safety',
      'Knot Tying (Square, Bowline, Clove Hitch)',
      'Shelter Building',
      'Water Purification',
      'Navigation & Map Reading',
      'Wilderness First Aid',
      'Leave No Trace Principles',
      'Rope & Cordage Skills',
      'Weather Prediction',
      'Plant & Animal Identification'
    ]
  },
  {
    category: 'Camping & Hiking',
    emoji: '🏕️',
    description: 'Develop camping and hiking expertise',
    skills: [
      'Tent Setup & Camp Layout',
      'Backpack Packing',
      'Trail Navigation',
      'Campfire Cooking',
      'Camp Hygiene & Sanitation',
      'Hiking Techniques',
      'Altitude Acclimatization',
      'Equipment Maintenance',
      'Weight Distribution',
      'Rest & Recovery Techniques'
    ]
  },
  {
    category: 'Leadership & Teamwork',
    emoji: '👥',
    description: 'Build strong leadership and team skills',
    skills: [
      'Scout Oath & Law',
      'Patrol Leadership',
      'Communication Skills',
      'Conflict Resolution',
      'Team Building Activities',
      'Delegation & Motivation',
      'Public Speaking',
      'Meeting Facilitation',
      'Decision Making',
      'Mentoring & Teaching'
    ]
  },
  {
    category: 'Outdoor Activities',
    emoji: '🎣',
    description: 'Master fishing, water sports, and recreation',
    skills: [
      'Fishing Techniques',
      'Knot Fishing',
      'Swimming & Water Safety',
      'Canoeing Basics',
      'Kayaking Skills',
      'Archery Fundamentals',
      'Orienteering',
      'Geocaching',
      'Climbing Belay',
      'Rock Scrambling'
    ]
  },
  {
    category: 'Practical Skills',
    emoji: '🔧',
    description: 'Learn essential practical and life skills',
    skills: [
      'Rope Splicing',
      'Tool Usage & Safety',
      'Basic Carpentry',
      'Emergency Preparedness',
      'CPR & First Aid',
      'Patch & Repair Skills',
      'Cooking Safety',
      'Nutrition Basics',
      'Gear Repair',
      'Emergency Signaling'
    ]
  },
  {
    category: 'Environmental Awareness',
    emoji: '🌍',
    description: 'Protect and understand our environment',
    skills: [
      'Leave No Trace Principles',
      'Environmental Conservation',
      'Wildlife Safety',
      'Invasive Species Control',
      'Trail Maintenance',
      'Waste Management',
      'Water Conservation',
      'Soil & Ecosystem Health',
      'Climate Awareness',
      'Sustainable Practices'
    ]
  },
  {
    category: 'Personal Development',
    emoji: '🌟',
    description: 'Grow as a person and a scout',
    skills: [
      'Goal Setting',
      'Time Management',
      'Problem Solving',
      'Stress Management',
      'Self-Discipline',
      'Confidence Building',
      'Service Learning',
      'Community Engagement',
      'Civic Responsibility',
      'Personal Values'
    ]
  },
  {
    category: 'Scout Advancement',
    emoji: '📈',
    description: 'Progress through ranks and achieve milestones',
    skills: [
      'Rank Requirements',
      'Merit Badge Planning',
      'Progression Tracking',
      'Board of Review Prep',
      'Eagle Scout Planning',
      'Project Management',
      'Scrapbooking & Documentation',
      'Leadership Service Project',
      'Milestone Celebrations',
      'Future Scouting Goals'
    ]
  }
];

export default function Skills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const filteredCategories = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: cat.skills.filter(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.skills.length > 0);

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
      <section className="section section--hero section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>🎖️ Scout Skills</h1>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
              Essential skills every scout should master on their journey to Eagle Scout
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ maxWidth: '500px', margin: '0 auto' }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              backdropFilter: 'blur(10px)'
            }}>
              <Search size={20} style={{ color: '#00d68f', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Categories */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}
          >
            {filteredCategories.map((category, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card"
                onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}
                style={{
                  padding: 24,
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: '2rem' }}>{category.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 4 }}>{category.category}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>
                      {category.skills.length} skills
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#d1d5db', marginBottom: 16 }}>
                  {category.description}
                </p>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: expandedCategory === idx ? 'auto' : 0,
                    opacity: expandedCategory === idx ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {category.skills.map((skill, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <CheckCircle2 size={16} style={{ color: '#00d68f', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem' }}>{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', paddingTop: 60 }}
            >
              <p style={{ fontSize: '1.1rem', color: '#9ca3af' }}>
                No skills found matching "{searchTerm}". Try a different search!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}
          >
            <h2 style={{ marginBottom: 16 }}>Master These Skills to Advance</h2>
            <p style={{ color: '#9ca3af', marginBottom: 32, fontSize: '1rem' }}>
              Click on any skill category to expand and see detailed skills. Work on these throughout your scout journey and track your progress through merit badges and rank requirements.
            </p>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Track My Skills
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
