
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const BADGE_CATEGORIES = [
  {
    category: 'Outdoor Skills',
    emoji: '🏕️',
    description: 'Master camping, hiking, and outdoor survival',
    badges: [
      { name: 'Camping', url: 'https://www.scouting.org/merit-badges/camping/' },
      { name: 'Hiking', url: 'https://www.scouting.org/merit-badges/hiking/' },
      { name: 'Cooking', url: 'https://www.scouting.org/merit-badges/cooking/' },
      { name: 'Fire Safety', url: 'https://www.scouting.org/merit-badges/fire-safety/' },
      { name: 'Water Sports', url: 'https://www.scouting.org/merit-badges/water-sports/' },
      { name: 'Archery', url: 'https://www.scouting.org/merit-badges/archery/' },
      { name: 'Fishing', url: 'https://www.scouting.org/merit-badges/fishing/' },
      { name: 'Orienteering', url: 'https://www.scouting.org/merit-badges/orienteering/' },
      { name: 'Backpacking', url: 'https://www.scouting.org/merit-badges/backpacking/' },
      { name: 'Wilderness Survival', url: 'https://www.scouting.org/merit-badges/wilderness-survival-skills/' },
      { name: 'Shotgun Shooting', url: 'https://www.scouting.org/merit-badges/shotgun-shooting/' },
      { name: 'Rifle Shooting', url: 'https://www.scouting.org/merit-badges/rifle-shooting/' },
      { name: 'Pistol Shooting', url: 'https://www.scouting.org/merit-badges/pistol-shooting/' },
      { name: 'Forestry', url: 'https://www.scouting.org/merit-badges/forestry/' },
      { name: 'Soil and Water Conservation', url: 'https://www.scouting.org/merit-badges/soil-and-water-conservation/' }
    ]
  },
  {
    category: 'Water Activities',
    emoji: '🚣',
    description: 'Master water-based skills and adventures',
    badges: [
      { name: 'Kayaking', url: 'https://www.scouting.org/merit-badges/kayaking/' },
      { name: 'Canoeing', url: 'https://www.scouting.org/merit-badges/canoeing/' },
      { name: 'Sailing', url: 'https://www.scouting.org/merit-badges/sailing/' },
      { name: 'Swimming', url: 'https://www.scouting.org/merit-badges/swimming/' },
      { name: 'Scuba Diving', url: 'https://www.scouting.org/merit-badges/scuba-diving/' },
      { name: 'Lifeguarding', url: 'https://www.scouting.org/merit-badges/lifeguarding/' },
      { name: 'Whitewater Rafting', url: 'https://www.scouting.org/merit-badges/whitewater-rafting/' },
      { name: 'Small-Boat Sailing', url: 'https://www.scouting.org/merit-badges/small-boat-sailing/' },
      { name: 'Motorboating', url: 'https://www.scouting.org/merit-badges/motorboating/' },
      { name: 'Surfing', url: 'https://www.scouting.org/merit-badges/surfing/' },
      { name: 'Fly Fishing', url: 'https://www.scouting.org/merit-badges/fly-fishing/' }
    ]
  },
  {
    category: 'Climbing & Adventure',
    emoji: '🧗',
    description: 'Challenge yourself with exciting adventures',
    badges: [
      { name: 'Rock Climbing', url: 'https://www.scouting.org/merit-badges/rock-climbing/' },
      { name: 'Mountaineering', url: 'https://www.scouting.org/merit-badges/mountaineering/' },
      { name: 'Rappelling', url: 'https://www.scouting.org/merit-badges/rock-climbing/' },
      { name: 'Geocaching', url: 'https://www.scouting.org/merit-badges/geocaching/' },
      { name: 'Skate Sports', url: 'https://www.scouting.org/merit-badges/skate-sports/' },
      { name: 'Climbing', url: 'https://www.scouting.org/merit-badges/climbing/' },
      { name: 'Skiing', url: 'https://www.scouting.org/merit-badges/skiing/' },
      { name: 'Snowboarding', url: 'https://www.scouting.org/merit-badges/snowboarding/' },
      { name: 'Bugling', url: 'https://www.scouting.org/merit-badges/bugling/' }
    ]
  },
  {
    category: 'Technology & Innovation',
    emoji: '💻',
    description: 'Develop skills in modern technology',
    badges: [
      { name: 'Programming', url: 'https://www.scouting.org/merit-badges/programming/' },
      { name: 'Robotics', url: 'https://www.scouting.org/merit-badges/robotics/' },
      { name: 'Electronics', url: 'https://www.scouting.org/merit-badges/electronics/' },
      { name: 'Cybersecurity', url: 'https://www.scouting.org/merit-badges/cybersecurity/' },
      { name: 'Web Design & Development', url: 'https://www.scouting.org/merit-badges/web-design-and-development/' },
      { name: 'Game Design & Development', url: 'https://www.scouting.org/merit-badges/game-design-and-development/' },
      { name: 'Digital Photography', url: 'https://www.scouting.org/merit-badges/digital-photography/' },
      { name: 'Drone Pilot', url: 'https://www.scouting.org/merit-badges/drone-pilot/' },
      { name: 'Radio', url: 'https://www.scouting.org/merit-badges/radio/' },
      { name: 'Computers', url: 'https://www.scouting.org/merit-badges/computers/' },
      { name: 'Geocaching', url: 'https://www.scouting.org/merit-badges/geocaching/' },
      { name: 'Sustainability', url: 'https://www.scouting.org/merit-badges/sustainability/' },
      { name: 'Animation', url: 'https://www.scouting.org/merit-badges/animation/' },
      { name: 'Coding', url: 'https://www.scouting.org/merit-badges/programming/' },
      { name: 'Search and Rescue', url: 'https://www.scouting.org/merit-badges/search-and-rescue/' }
    ]
  },
  {
    category: 'Arts & Crafts',
    emoji: '🎨',
    description: 'Express creativity through various mediums',
    badges: [
      { name: 'Painting', url: 'https://www.scouting.org/merit-badges/painting/' },
      { name: 'Sculpture', url: 'https://www.scouting.org/merit-badges/sculpture/' },
      { name: 'Photography', url: 'https://www.scouting.org/merit-badges/photography/' },
      { name: 'Music', url: 'https://www.scouting.org/merit-badges/music/' },
      { name: 'Theater', url: 'https://www.scouting.org/merit-badges/theater/' },
      { name: 'Writing', url: 'https://www.scouting.org/merit-badges/writing/' },
      { name: 'Woodworking', url: 'https://www.scouting.org/merit-badges/woodworking/' },
      { name: 'Leatherworking', url: 'https://www.scouting.org/merit-badges/leatherworking/' },
      { name: 'Graphic Design', url: 'https://www.scouting.org/merit-badges/graphic-design/' },
      { name: 'Animation', url: 'https://www.scouting.org/merit-badges/animation/' },
      { name: 'Jewelry', url: 'https://www.scouting.org/merit-badges/jewelry/' },
      { name: 'Metalworking', url: 'https://www.scouting.org/merit-badges/metalworking/' },
      { name: 'Pottery', url: 'https://www.scouting.org/merit-badges/pottery/' },
      { name: 'Glass Blowing', url: 'https://www.scouting.org/merit-badges/glass-blowing/' },
      { name: 'Quilting', url: 'https://www.scouting.org/merit-badges/quilting/' }
    ]
  },
  {
    category: 'Science & Nature',
    emoji: '🔬',
    description: 'Explore the natural and scientific world',
    badges: [
      { name: 'Environmental Science', url: 'https://www.scouting.org/merit-badges/environmental-science/' },
      { name: 'Botany', url: 'https://www.scouting.org/merit-badges/botany/' },
      { name: 'Zoology', url: 'https://www.scouting.org/merit-badges/zoology/' },
      { name: 'Geology', url: 'https://www.scouting.org/merit-badges/geology/' },
      { name: 'Astronomy', url: 'https://www.scouting.org/merit-badges/astronomy/' },
      { name: 'Weather', url: 'https://www.scouting.org/merit-badges/weather/' },
      { name: 'Sustainability', url: 'https://www.scouting.org/merit-badges/sustainability/' },
      { name: 'Mammal Study', url: 'https://www.scouting.org/merit-badges/mammal-study/' },
      { name: 'Bird Study', url: 'https://www.scouting.org/merit-badges/bird-study/' },
      { name: 'Insect Study', url: 'https://www.scouting.org/merit-badges/insect-study/' },
      { name: 'Fish and Wildlife Management', url: 'https://www.scouting.org/merit-badges/fish-and-wildlife-management/' },
      { name: 'Plant Science', url: 'https://www.scouting.org/merit-badges/plant-science/' },
      { name: 'Oceanography', url: 'https://www.scouting.org/merit-badges/oceanography/' },
      { name: 'Space Exploration', url: 'https://www.scouting.org/merit-badges/space-exploration/' },
      { name: 'Reptile and Amphibian Study', url: 'https://www.scouting.org/merit-badges/reptile-and-amphibian-study/' }
    ]
  },
  {
    category: 'Community Service',
    emoji: '🤝',
    description: 'Make a difference in your community',
    badges: [
      { name: 'Emergency Preparedness', url: 'https://www.scouting.org/merit-badges/emergency-preparedness/' },
      { name: 'First Aid', url: 'https://www.scouting.org/merit-badges/first-aid/' },
      { name: 'Leadership', url: 'https://www.scouting.org/merit-badges/leadership/' },
      { name: 'Public Speaking', url: 'https://www.scouting.org/merit-badges/public-speaking/' },
      { name: 'Community Service', url: 'https://www.scouting.org/merit-badges/community-service/' },
      { name: 'Diversity & Inclusion', url: 'https://www.scouting.org/merit-badges/diversity-and-inclusion/' },
      { name: 'Family Life', url: 'https://www.scouting.org/merit-badges/family-life/' },
      { name: 'Personal Fitness', url: 'https://www.scouting.org/merit-badges/personal-fitness/' },
      { name: 'Citizenship in the Community', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-community/' },
      { name: 'Lifesaving', url: 'https://www.scouting.org/merit-badges/lifesaving/' },
      { name: 'Citizenship in the Nation', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-nation/' },
      { name: 'Citizenship in the World', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-world/' },
      { name: 'Communication', url: 'https://www.scouting.org/merit-badges/communication/' },
      { name: 'Disability Awareness', url: 'https://www.scouting.org/merit-badges/disability-awareness/' },
      { name: 'Personal Safety', url: 'https://www.scouting.org/merit-badges/personal-safety/' }
    ]
  },
  {
    category: 'Health & Fitness',
    emoji: '💪',
    description: 'Build strength, endurance, and wellness',
    badges: [
      { name: 'Sports', url: 'https://www.scouting.org/merit-badges/sports/' },
      { name: 'Fitness', url: 'https://www.scouting.org/merit-badges/fitness/' },
      { name: 'Nutrition', url: 'https://www.scouting.org/merit-badges/nutrition/' },
      { name: 'Mental Health', url: 'https://www.scouting.org/merit-badges/mental-health/' },
      { name: 'Personal Safety', url: 'https://www.scouting.org/merit-badges/personal-safety/' },
      { name: 'Physical Fitness', url: 'https://www.scouting.org/merit-badges/physical-fitness/' },
      { name: 'Backpacking', url: 'https://www.scouting.org/merit-badges/backpacking/' },
      { name: 'Medical Preparedness', url: 'https://www.scouting.org/merit-badges/emergency-preparedness/' },
      { name: 'First Responder', url: 'https://www.scouting.org/merit-badges/first-aid/' },
      { name: 'Cycling', url: 'https://www.scouting.org/merit-badges/cycling/' }
    ]
  },
  {
    category: 'Career Exploration',
    emoji: '🎯',
    description: 'Discover your path to success',
    badges: [
      { name: 'Business', url: 'https://www.scouting.org/merit-badges/business/' },
      { name: 'Engineering', url: 'https://www.scouting.org/merit-badges/engineering/' },
      { name: 'Medicine', url: 'https://www.scouting.org/merit-badges/medicine/' },
      { name: 'Law', url: 'https://www.scouting.org/merit-badges/law/' },
      { name: 'Teaching', url: 'https://www.scouting.org/merit-badges/teaching/' },
      { name: 'Military Service', url: 'https://www.scouting.org/merit-badges/military-service/' },
      { name: 'Entrepreneurship', url: 'https://www.scouting.org/merit-badges/entrepreneurship/' },
      { name: 'Career Exploration', url: 'https://www.scouting.org/merit-badges/career-exploration/' },
      { name: 'Construction', url: 'https://www.scouting.org/merit-badges/construction/' },
      { name: 'Plumbing', url: 'https://www.scouting.org/merit-badges/plumbing/' },
      { name: 'Automotive Maintenance', url: 'https://www.scouting.org/merit-badges/automotive-maintenance/' },
      { name: 'Welding', url: 'https://www.scouting.org/merit-badges/welding/' },
      { name: 'Farm Mechanics', url: 'https://www.scouting.org/merit-badges/farm-mechanics/' },
      { name: 'Landscape Architecture', url: 'https://www.scouting.org/merit-badges/landscape-architecture/' },
      { name: 'Public Health', url: 'https://www.scouting.org/merit-badges/public-health/' }
    ]
  },
  {
    category: 'Additional Skills',
    emoji: '⭐',
    description: 'Expand your knowledge and abilities',
    badges: [
      { name: 'Cooking', url: 'https://www.scouting.org/merit-badges/cooking/' },
      { name: 'Camping', url: 'https://www.scouting.org/merit-badges/camping/' },
      { name: 'Orienteering', url: 'https://www.scouting.org/merit-badges/orienteering/' },
      { name: 'Identification', url: 'https://www.scouting.org/merit-badges/identification/' },
      { name: 'Model Design and Building', url: 'https://www.scouting.org/merit-badges/model-design-and-building/' },
      { name: 'Debt Management', url: 'https://www.scouting.org/merit-badges/debt-management/' },
      { name: 'Personal Management', url: 'https://www.scouting.org/merit-badges/personal-management/' },
      { name: 'Scholarship', url: 'https://www.scouting.org/merit-badges/scholarship/' },
      { name: 'Safety', url: 'https://www.scouting.org/merit-badges/personal-safety/' },
      { name: 'Lifeguard', url: 'https://www.scouting.org/merit-badges/lifeguarding/' },
      { name: 'Swimming', url: 'https://www.scouting.org/merit-badges/swimming/' },
      { name: 'Canoeing', url: 'https://www.scouting.org/merit-badges/canoeing/' },
      { name: 'Hiking', url: 'https://www.scouting.org/merit-badges/hiking/' },
      { name: 'Camping', url: 'https://www.scouting.org/merit-badges/camping/' },
      { name: 'Fishing', url: 'https://www.scouting.org/merit-badges/fishing/' }
    ]
  },
  {
    category: 'Eagle Required',
    emoji: '🦅',
    description: 'Required badges to achieve Eagle Scout rank',
    badges: [
      { name: 'First Aid', url: 'https://www.scouting.org/merit-badges/first-aid/' },
      { name: 'Cooking', url: 'https://www.scouting.org/merit-badges/cooking/' },
      { name: 'Camping', url: 'https://www.scouting.org/merit-badges/camping/' },
      { name: 'Citizenship in the Community', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-community/' },
      { name: 'Citizenship in the Nation', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-nation/' },
      { name: 'Citizenship in the World', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-world/' },
      { name: 'Emergency Preparedness', url: 'https://www.scouting.org/merit-badges/emergency-preparedness/' },
      { name: 'Lifesaving', url: 'https://www.scouting.org/merit-badges/lifesaving/' },
      { name: 'Swimming', url: 'https://www.scouting.org/merit-badges/swimming/' },
      { name: 'Environmental Science', url: 'https://www.scouting.org/merit-badges/environmental-science/' },
      { name: 'Personal Fitness', url: 'https://www.scouting.org/merit-badges/personal-fitness/' },
      { name: 'Leadership', url: 'https://www.scouting.org/merit-badges/leadership/' },
      { name: 'Communication', url: 'https://www.scouting.org/merit-badges/communication/' }
    ]
  }
];

export default function Badges() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  const filteredCategories = BADGE_CATEGORIES.filter(cat =>
    cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.badges.some(badge => badge.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <h1 style={{ marginBottom: 24 }}>Merit Badges</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 700, margin: '0 auto' }}>
              Explore over 140 merit badges across 8 categories. Each badge represents mastery of a skill, knowledge, or service to your community. Earn badges to progress toward Eagle Scout!
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE MERIT BADGE PROCESS */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 40 }}>
              <h2 style={{ marginBottom: 32 }}>The Merit Badge Process</h2>

              <ol style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <li style={{ marginBottom: 16 }}>
                  The Scout develops an interest in a merit badge and may begin working on the requirements.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout and unit leader discuss the Scout's interest in the merit badge.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The unit leader signs a blue card or otherwise documents the conversation and provides the Scout with at least one counselor contact.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout contacts the counselor.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The counselor considers any work toward requirements completed prior to the initial discussion with the unit leader.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout and the counselor meet, as many times as necessary. The counselor reviews work, to verify that the Scout has actually and personally completed each requirement exactly as written. For merit badge counselor meetings only, the Scout, parent or guardian, and counselor can meet. In a group setting with two or more Scouts, there must be at least two registered leaders present, in accordance with the Guide to Safe Scouting.
                </li>
                <li style={{ marginBottom: 16 }}>
                  Partial progress is recorded as requirements are completed.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout finishes the requirements.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The counselor approves completion and signs the blue card or other documentation.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout gives the blue card or other evidence of completion to the unit leader. The unit leader signs the applicant record section of the blue card or otherwise documents completion of the merit badge.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The unit leader gives the Scout the applicant record portion of the blue card or other hard copy record that the Scout may retain.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The unit reports completion of the merit badge.
                </li>
                <li>
                  The Scout receives the merit badge.
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search badges or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ paddingLeft: 44 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="section section--dark">
        <div className="container">
          {filteredCategories.length > 0 ? (
            <motion.div
              className="grid grid--cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              style={{ gap: 24 }}
            >
              {filteredCategories.map((catItem, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-card"
                  style={{ padding: 28, cursor: 'pointer', transition: 'all 0.3s ease' }}
                  whileHover={{ scale: 1.02, borderColor: 'var(--accent-border)' }}
                  onClick={() => setSelectedCategory(selectedCategory === i ? null : i)}
                >
                  {/* Category Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: '3rem' }}>{catItem.emoji}</div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{catItem.category}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{catItem.badges.length} badges</p>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 16 }}>
                    {catItem.description}
                  </p>

                  {/* Badges Grid */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: selectedCategory === i ? 1 : 0, height: selectedCategory === i ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, paddingTop: 16, borderTop: '1px solid var(--divider)' }}>
                      {catItem.badges.map((badge, j) => (
                        <motion.a
                          key={j}
                          href={badge.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 12px',
                            background: 'var(--accent-dim)',
                            borderRadius: 8,
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            border: '1px solid var(--accent-dim)',
                            display: 'block',
                            textDecoration: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all 0.3s ease'
                          }}
                          whileHover={{
                            background: 'var(--accent-dim)',
                            borderColor: 'var(--accent)',
                            scale: 1.05
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {badge.name}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>

                  {/* Expand Button */}
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <motion.div
                      animate={{ rotate: selectedCategory === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'inline-block' }}
                    >
                      <ArrowRight size={18} style={{ color: 'var(--accent)' }} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No badges found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>

      {/* BADGE INFO SECTION */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 40 }}>
              <h2 style={{ marginBottom: 24 }}>About Merit Badges</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--accent)' }}>140+ Badges</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Choose from a wide variety of merit badges covering skills, hobbies, and interests.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--accent)' }}>Rank Progress</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Earn required badges to advance ranks and work toward the prestigious Eagle Scout rank.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--accent)' }}>Skill Development</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Master new skills, explore careers, and discover lifelong passions through badge work.
                  </p>
                </div>
              </div>

              <motion.a
                href="https://www.scouting.org/skills/merit-badges/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ marginTop: 32, width: '100%', display: 'block', textAlign: 'center' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Merit Badges on Scouting.org
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
