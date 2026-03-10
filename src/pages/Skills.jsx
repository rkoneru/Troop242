
import { Search, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SKILL_CATEGORIES = [
  {
    category: 'Outdoor Survival',
    emoji: '🔥',
    description: 'Master essential survival and outdoor skills',
    skills: [
      { name: 'Fire Building & Safety', description: 'Learn to safely build, maintain, and extinguish campfires using proper techniques and fire safety protocols.' },
      { name: 'Knot Tying (Square, Bowline, Clove Hitch)', description: 'Master essential knots used in camping, climbing, and outdoor activities for securing gear and safety.' },
      { name: 'Shelter Building', description: 'Develop skills to construct emergency and temporary shelters using natural materials and survival techniques.' },
      { name: 'Water Purification', description: 'Learn methods to safely purify water including boiling, filtering, and chemical treatment for outdoor settings.' },
      { name: 'Navigation & Map Reading', description: 'Master reading topographic maps, using a compass, and navigating through various terrains without GPS.' },
      { name: 'Wilderness First Aid', description: 'Gain knowledge to treat injuries and medical emergencies in remote outdoor environments.' },
      { name: 'Leave No Trace Principles', description: 'Understand environmental ethics and practices to minimize human impact on nature.' },
      { name: 'Rope & Cordage Skills', description: 'Learn rope care, storage, and practical applications in outdoor and camping scenarios.' },
      { name: 'Weather Prediction', description: 'Develop skills to read natural signs and forecast weather changes for outdoor planning.' },
      { name: 'Plant & Animal Identification', description: 'Learn to identify local flora and fauna, understanding their characteristics and ecological roles.' }
    ]
  },
  {
    category: 'Camping & Hiking',
    emoji: '🏕️',
    description: 'Develop camping and hiking expertise',
    skills: [
      { name: 'Tent Setup & Camp Layout', description: 'Learn to properly pitch tents, arrange camp sites for safety and efficiency, and set up sleeping areas in various terrains.' },
      { name: 'Backpack Packing', description: 'Master the techniques of efficiently packing a backpack for weight distribution, accessibility, and comfort during outdoor trips.' },
      { name: 'Trail Navigation', description: 'Develop skills to follow trails, read trail markers, and navigate safely through forests and mountains.' },
      { name: 'Campfire Cooking', description: 'Learn to prepare delicious and nutritious meals over a campfire using proper cooking techniques and fire management.' },
      { name: 'Camp Hygiene & Sanitation', description: 'Understand proper hygiene practices at camp including water use, bathroom facilities, and food storage to prevent illness.' },
      { name: 'Hiking Techniques', description: 'Master proper walking posture, pace management, and techniques for different terrain to hike safely and efficiently.' },
      { name: 'Altitude Acclimatization', description: 'Learn to recognize and manage altitude sickness symptoms and properly acclimate to high elevations.' },
      { name: 'Equipment Maintenance', description: 'Develop skills to care for camping gear including tents, sleeping bags, cookware, and backpacks for longevity.' },
      { name: 'Weight Distribution', description: 'Learn to balance and distribute weight in your backpack to reduce strain and improve hiking efficiency.' },
      { name: 'Rest & Recovery Techniques', description: 'Understand proper rest strategies, stretching, and recovery methods to prevent injury during extended outdoor activities.' }
    ]
  },
  {
    category: 'Leadership & Teamwork',
    emoji: '👥',
    description: 'Build strong leadership and team skills',
    skills: [
      { name: 'Scout Oath & Law', description: 'Understand and embody the core values and principles of Scouting through the Scout Oath and Law.' },
      { name: 'Patrol Leadership', description: 'Develop skills to lead a scout patrol effectively, including organizing activities and supporting patrol members.' },
      { name: 'Communication Skills', description: 'Master clear and active communication, including listening, speaking, and understanding different perspectives.' },
      { name: 'Conflict Resolution', description: 'Learn techniques to mediate disagreements and resolve conflicts constructively within your scout community.' },
      { name: 'Team Building Activities', description: 'Develop and facilitate activities that strengthen team bonds, trust, and cooperation among scouts.' },
      { name: 'Delegation & Motivation', description: 'Learn to assign tasks effectively and inspire others to achieve their best in scouting activities.' },
      { name: 'Public Speaking', description: 'Overcome stage fright and develop skills to present information clearly and confidently to groups.' },
      { name: 'Meeting Facilitation', description: 'Master techniques for running effective scout meetings, including agendas, discussion management, and time management.' },
      { name: 'Decision Making', description: 'Develop critical thinking skills to make informed decisions that benefit the scout unit and its members.' },
      { name: 'Mentoring & Teaching', description: 'Learn to guide younger scouts and teach new skills with patience, encouragement, and clear explanations.' }
    ]
  },
  {
    category: 'Outdoor Activities',
    emoji: '🎣',
    description: 'Master fishing, water sports, and recreation',
    skills: [
      { name: 'Fishing Techniques', description: 'Learn casting, rod handling, and fish identification to successfully fish in different water environments.' },
      { name: 'Knot Fishing', description: 'Master specialized fishing knots including the clinch knot, improved clinch knot, and palomar knot for secure line attachments.' },
      { name: 'Swimming & Water Safety', description: 'Develop strong swimming skills and learn water safety protocols to prevent drowning and water-related accidents.' },
      { name: 'Canoeing Basics', description: 'Learn proper paddling techniques, canoe handling, and safety procedures for peaceful water exploration.' },
      { name: 'Kayaking Skills', description: 'Master kayak propulsion, balance, and maneuvering techniques for enjoyable and safe kayaking adventures.' },
      { name: 'Archery Fundamentals', description: 'Learn proper stance, aim, and release techniques for accurate and safe archery practice.' },
      { name: 'Orienteering', description: 'Develop navigation skills using map and compass to find specific locations in outdoor environments.' },
      { name: 'Geocaching', description: 'Learn to use GPS technology and coordinates to locate hidden treasure containers in outdoor settings.' },
      { name: 'Climbing Belay', description: 'Master the essential belay techniques and safety procedures to protect climbers during rock climbing activities.' },
      { name: 'Rock Scrambling', description: 'Learn safe climbing techniques for moving over rocky terrain without technical rock climbing equipment.' }
    ]
  },
  {
    category: 'Practical Skills',
    emoji: '🔧',
    description: 'Learn essential practical and life skills',
    skills: [
      { name: 'Rope Splicing', description: 'Learn traditional rope splicing techniques to create secure joints and repair damaged ropes.' },
      { name: 'Tool Usage & Safety', description: 'Understand proper handling and safety protocols for common tools including hammers, saws, and screwdrivers.' },
      { name: 'Basic Carpentry', description: 'Learn fundamental woodworking skills including measuring, cutting, and joining wood for simple projects.' },
      { name: 'Emergency Preparedness', description: 'Develop a plan for emergencies, know what supplies to have, and understand basic emergency procedures.' },
      { name: 'CPR & First Aid', description: 'Learn life-saving cardiopulmonary resuscitation and first aid techniques to help in medical emergencies.' },
      { name: 'Patch & Repair Skills', description: 'Master techniques to repair torn fabric, clothing, and gear using sewing and patching methods.' },
      { name: 'Cooking Safety', description: 'Learn safe food handling, proper kitchen practices, and burn/cut prevention in cooking environments.' },
      { name: 'Nutrition Basics', description: 'Understand balanced nutrition, food groups, and healthy eating habits for active outdoor lifestyles.' },
      { name: 'Gear Repair', description: 'Learn to fix common gear problems including broken straps, zippers, and tears in outdoor equipment.' },
      { name: 'Emergency Signaling', description: 'Master techniques to signal for help using whistles, mirrors, fire, and other emergency signaling methods.' }
    ]
  },
  {
    category: 'Environmental Awareness',
    emoji: '🌍',
    description: 'Protect and understand our environment',
    skills: [
      { name: 'Leave No Trace Principles', description: 'Master seven principles of outdoor ethics to minimize human impact and protect natural environments.' },
      { name: 'Environmental Conservation', description: 'Learn actions to protect ecosystems, wildlife habitats, and natural resources for future generations.' },
      { name: 'Wildlife Safety', description: 'Understand safe practices around wildlife including maintaining distance, food storage, and encounter responses.' },
      { name: 'Invasive Species Control', description: 'Identify invasive species threatening local ecosystems and participate in removal and prevention efforts.' },
      { name: 'Trail Maintenance', description: 'Develop skills to maintain hiking trails including clearing brush, repairing erosion, and marking paths.' },
      { name: 'Waste Management', description: 'Learn proper waste disposal, recycling, and composting practices for outdoor and home environments.' },
      { name: 'Water Conservation', description: 'Understand freshwater scarcity and practice conservation techniques in daily life and outdoor settings.' },
      { name: 'Soil & Ecosystem Health', description: 'Learn about soil composition, plant growth, and ecosystem relationships that support all life.' },
      { name: 'Climate Awareness', description: 'Understand climate change impacts and develop practices to reduce carbon footprint and environmental damage.' },
      { name: 'Sustainable Practices', description: 'Adopt lifestyle practices that reduce environmental impact including energy use, consumption, and waste.' }
    ]
  },
  {
    category: 'Personal Development',
    emoji: '🌟',
    description: 'Grow as a person and a scout',
    skills: [
      { name: 'Goal Setting', description: 'Learn to set realistic, measurable goals and develop action plans to achieve them.' },
      { name: 'Time Management', description: 'Master techniques to prioritize tasks, manage schedules, and use time effectively.' },
      { name: 'Problem Solving', description: 'Develop critical thinking skills to identify problems and generate creative solutions.' },
      { name: 'Stress Management', description: 'Learn healthy coping strategies and relaxation techniques to manage stress and anxiety.' },
      { name: 'Self-Discipline', description: 'Build the willpower and consistency needed to maintain good habits and achieve long-term goals.' },
      { name: 'Confidence Building', description: 'Develop self-esteem and confidence through overcoming challenges and celebrating successes.' },
      { name: 'Service Learning', description: 'Understand how service projects teach valuable lessons and strengthen communities.' },
      { name: 'Community Engagement', description: 'Learn to actively participate in and contribute positively to your local community.' },
      { name: 'Civic Responsibility', description: 'Understand your role as a citizen and develop commitment to serving the greater good.' },
      { name: 'Personal Values', description: 'Reflect on and clarify your core values that guide your decisions and actions.' }
    ]
  },
  {
    category: 'Scout Advancement',
    emoji: '📈',
    description: 'Progress through ranks and achieve milestones',
    skills: [
      { name: 'Rank Requirements', description: 'Understand the requirements for each scout rank from Tenderfoot through Eagle Scout.' },
      { name: 'Merit Badge Planning', description: 'Learn to select merit badges that interest you and plan your path to completing them.' },
      { name: 'Progression Tracking', description: 'Keep organized records of completed requirements and badges to monitor your advancement.' },
      { name: 'Board of Review Prep', description: 'Prepare thoroughly for Board of Review by documenting accomplishments and practicing responses.' },
      { name: 'Eagle Scout Planning', description: 'Develop a comprehensive plan for achieving Eagle Scout including timeline and goal-setting.' },
      { name: 'Project Management', description: 'Learn to plan, organize, and execute your Eagle Scout service project successfully.' },
      { name: 'Scrapbooking & Documentation', description: 'Create organized records and memories of your scouting journey through documentation methods.' },
      { name: 'Leadership Service Project', description: 'Understand how leadership service projects develop character while benefiting your community.' },
      { name: 'Milestone Celebrations', description: 'Recognize and celebrate advancement milestones to maintain motivation and scout pride.' },
      { name: 'Future Scouting Goals', description: 'Plan your continued journey in scouting beyond rank achievements and personal development.' }
    ]
  }
];

export default function Skills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const filteredCategories = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: cat.skills.filter(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      return skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             cat.category.toLowerCase().includes(searchTerm.toLowerCase());
    })
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
      <section className="hero-page section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>🎖️ Scout Skills</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
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
              backgroundColor: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '12px',
              padding: '12px 16px',
              backdropFilter: 'blur(10px)'
            }}>
              <Search size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
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
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      {category.skills.length} skills
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--divider)' }}>
                    {category.skills.map((skill, i) => {
                      const skillName = typeof skill === 'string' ? skill : skill.name;
                      const skillDesc = typeof skill === 'string' ? null : skill.description;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => skillDesc && setSelectedSkill({ name: skillName, description: skillDesc })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: skillDesc ? 'pointer' : 'default',
                            transition: 'all 0.2s'
                          }}
                        >
                          <CheckCircle2 size={16} style={{ color: 'var(--text-muted)', opacity: 0.5, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.9rem' }}>{skillName}</span>
                        </motion.div>
                      );
                    })}
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
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
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
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '1rem' }}>
              Click on any skill category to expand and see detailed skills. Work on these throughout your scout journey and track your progress through merit badges and rank requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skill Details Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                padding: 32,
                maxWidth: '500px',
                width: '90vw',
                margin: '0 auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedSkill.name}</h2>
                <motion.button
                  onClick={() => setSelectedSkill(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                {selectedSkill.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
