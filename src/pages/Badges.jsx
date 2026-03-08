
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const BADGE_CATEGORIES = [
  {
    category: 'Eagle Required',
    emoji: '🦅',
    description: 'The 13 required badges for Eagle Scout rank',
    badges: [
      { name: 'Camping', url: 'https://www.scouting.org/merit-badges/camping/' },
      { name: 'Cooking', url: 'https://www.scouting.org/merit-badges/cooking/' },
      { name: 'First Aid', url: 'https://www.scouting.org/merit-badges/first-aid/' },
      { name: 'Citizenship in the Community', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-community/' },
      { name: 'Citizenship in the Nation', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-nation/' },
      { name: 'Citizenship in Society', url: 'https://www.scouting.org/merit-badges/citizenship-in-society/' },
      { name: 'Communication', url: 'https://www.scouting.org/merit-badges/communication/' },
      { name: 'Emergency Preparedness', url: 'https://www.scouting.org/merit-badges/emergency-preparedness/' },
      { name: 'Environmental Science', url: 'https://www.scouting.org/merit-badges/environmental-science/' },
      { name: 'Personal Fitness', url: 'https://www.scouting.org/merit-badges/personal-fitness/' },
      { name: 'Lifesaving', url: 'https://www.scouting.org/merit-badges/lifesaving/' },
      { name: 'Swimming', url: 'https://www.scouting.org/merit-badges/swimming/' },
      { name: 'Leadership', url: 'https://www.scouting.org/merit-badges/leadership/' }
    ]
  },
  {
    category: 'Citizenship & Community',
    emoji: '🤝',
    description: 'Make a difference in your community and nation',
    badges: [
      { name: 'Leadership', url: 'https://www.scouting.org/merit-badges/leadership/' },
      { name: 'Communication', url: 'https://www.scouting.org/merit-badges/communication/' },
      { name: 'Citizenship in the Community', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-community/' },
      { name: 'Citizenship in the Nation', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-nation/' },
      { name: 'Citizenship in Society', url: 'https://www.scouting.org/merit-badges/citizenship-in-society/' },
      { name: 'Public Speaking', url: 'https://www.scouting.org/merit-badges/public-speaking/' },
      { name: 'Emergency Preparedness', url: 'https://www.scouting.org/merit-badges/emergency-preparedness/' },
      { name: 'First Aid', url: 'https://www.scouting.org/merit-badges/first-aid/' },
      { name: 'Family Life', url: 'https://www.scouting.org/merit-badges/family-life/' },
      { name: 'Personal Safety', url: 'https://www.scouting.org/merit-badges/personal-safety/' },
      { name: 'Safety', url: 'https://www.scouting.org/merit-badges/safety/' },
      { name: 'Crime Prevention', url: 'https://www.scouting.org/merit-badges/crime-prevention/' },
      { name: 'Disabilities Awareness', url: 'https://www.scouting.org/merit-badges/disabilities-awareness/' },
      { name: 'Diversity and Inclusion', url: 'https://www.scouting.org/merit-badges/diversity-and-inclusion/' },
      { name: 'United Nations', url: 'https://www.scouting.org/merit-badges/united-nations/' }
    ]
  },
  {
    category: 'Business & Personal Development',
    emoji: '💼',
    description: 'Build skills for personal and professional success',
    badges: [
      { name: 'Business', url: 'https://www.scouting.org/merit-badges/business/' },
      { name: 'Entrepreneurship', url: 'https://www.scouting.org/merit-badges/entrepreneurship/' },
      { name: 'Personal Management', url: 'https://www.scouting.org/merit-badges/personal-management/' },
      { name: 'Debt Management', url: 'https://www.scouting.org/merit-badges/debt-management/' },
      { name: 'Scholarship', url: 'https://www.scouting.org/merit-badges/scholarship/' },
      { name: 'Salesmanship', url: 'https://www.scouting.org/merit-badges/salesmanship/' },
      { name: 'Inventing', url: 'https://www.scouting.org/merit-badges/inventing/' },
      { name: 'Lifeguard', url: 'https://www.scouting.org/merit-badges/lifeguard/' },
      { name: 'Small Business Management', url: 'https://www.scouting.org/merit-badges/small-business-management/' }
    ]
  },
  {
    category: 'American History & Culture',
    emoji: '🇺🇸',
    description: 'Learn about American heritage and cultures',
    badges: [
      { name: 'American Heritage', url: 'https://www.scouting.org/merit-badges/american-heritage/' },
      { name: 'American Cultures', url: 'https://www.scouting.org/merit-badges/american-cultures/' },
      { name: 'American Indian Culture', url: 'https://www.scouting.org/merit-badges/american-indian-culture/' },
      { name: 'American Business', url: 'https://www.scouting.org/merit-badges/american-business/' },
      { name: 'American Labor', url: 'https://www.scouting.org/merit-badges/american-labor/' },
      { name: 'Mining in Society', url: 'https://www.scouting.org/merit-badges/mining-in-society/' },
      { name: 'Composite Materials', url: 'https://www.scouting.org/merit-badges/composite-materials/' },
      { name: 'Nuclear Science', url: 'https://www.scouting.org/merit-badges/nuclear-science/' },
      { name: 'Sustainability', url: 'https://www.scouting.org/merit-badges/sustainability/' },
      { name: 'Energy', url: 'https://www.scouting.org/merit-badges/energy/' },
      { name: 'Maritime Exploration', url: 'https://www.scouting.org/merit-badges/maritime-exploration/' },
      { name: 'Money Management', url: 'https://www.scouting.org/merit-badges/money-management/' }
    ]
  },
  {
    category: 'Hobbies & Collections',
    emoji: '⭐',
    description: 'Expand your knowledge and hobbies',
    badges: [
      { name: 'Stamp Collecting', url: 'https://www.scouting.org/merit-badges/stamp-collecting/' },
      { name: 'Coin Collecting', url: 'https://www.scouting.org/merit-badges/coin-collecting/' },
      { name: 'Archaeology', url: 'https://www.scouting.org/merit-badges/archaeology/' },
      { name: 'Genealogy', url: 'https://www.scouting.org/merit-badges/genealogy/' },
      { name: 'Fingerprinting', url: 'https://www.scouting.org/merit-badges/fingerprinting/' },
      { name: 'Pets', url: 'https://www.scouting.org/merit-badges/pets/' },
      { name: 'Dog Care', url: 'https://www.scouting.org/merit-badges/dog-care/' },
      { name: 'Horse', url: 'https://www.scouting.org/merit-badges/horse/' },
      { name: 'Nutrition', url: 'https://www.scouting.org/merit-badges/nutrition/' },
      { name: 'Pulp and Paper', url: 'https://www.scouting.org/merit-badges/pulp-and-paper/' },
      { name: 'Beekeeping', url: 'https://www.scouting.org/merit-badges/beekeeping/' },
      { name: 'Woodcarving', url: 'https://www.scouting.org/merit-badges/woodcarving/' }
    ]
  },
  {
    category: 'Games & Mental Skills',
    emoji: '♟️',
    description: 'Challenge your mind with games and puzzles',
    badges: [
      { name: 'Chess', url: 'https://www.scouting.org/merit-badges/chess/' },
      { name: 'Multisport', url: 'https://www.scouting.org/merit-badges/multisport/' },
      { name: 'Drafting', url: 'https://www.scouting.org/merit-badges/drafting/' },
      { name: 'Game Design', url: 'https://www.scouting.org/merit-badges/game-design/' }
    ]
  },
  {
    category: 'Arts, Crafts & Design',
    emoji: '🎨',
    description: 'Express creativity through various mediums',
    badges: [
      { name: 'Painting', url: 'https://www.scouting.org/merit-badges/painting/' },
      { name: 'Sculpture', url: 'https://www.scouting.org/merit-badges/sculpture/' },
      { name: 'Music', url: 'https://www.scouting.org/merit-badges/music/' },
      { name: 'Theater', url: 'https://www.scouting.org/merit-badges/theater/' },
      { name: 'Writing', url: 'https://www.scouting.org/merit-badges/writing/' },
      { name: 'Reading', url: 'https://www.scouting.org/merit-badges/reading/' },
      { name: 'Journalism', url: 'https://www.scouting.org/merit-badges/journalism/' },
      { name: 'Graphic Arts', url: 'https://www.scouting.org/merit-badges/graphic-arts/' },
      { name: 'Woodwork', url: 'https://www.scouting.org/merit-badges/woodwork/' },
      { name: 'Leatherwork', url: 'https://www.scouting.org/merit-badges/leatherwork/' },
      { name: 'Pottery', url: 'https://www.scouting.org/merit-badges/pottery/' },
      { name: 'Metalwork', url: 'https://www.scouting.org/merit-badges/metalwork/' },
      { name: 'Model Design and Building', url: 'https://www.scouting.org/merit-badges/model-design-and-building/' },
      { name: 'Collections', url: 'https://www.scouting.org/merit-badges/collections/' },
      { name: 'Basketry', url: 'https://www.scouting.org/merit-badges/basketry/' },
      { name: 'Animation', url: 'https://www.scouting.org/merit-badges/animation/' },
      { name: 'Digital Arts and Photography', url: 'https://www.scouting.org/merit-badges/digital-arts-and-photography/' },
      { name: 'Textile and Fiber Arts', url: 'https://www.scouting.org/merit-badges/textile-and-fiber-arts/' }
    ]
  },
  {
    category: 'Sports & Recreation',
    emoji: '⚽',
    description: 'Challenge yourself with active pursuits',
    badges: [
      { name: 'Archery', url: 'https://www.scouting.org/merit-badges/archery/' },
      { name: 'Water Sports', url: 'https://www.scouting.org/merit-badges/water-sports/' },
      { name: 'Rifle Shooting', url: 'https://www.scouting.org/merit-badges/rifle-shooting/' },
      { name: 'Shotgun Shooting', url: 'https://www.scouting.org/merit-badges/shotgun-shooting/' },
      { name: 'Cycling', url: 'https://www.scouting.org/merit-badges/cycling/' },
      { name: 'Sports', url: 'https://www.scouting.org/merit-badges/sports/' },
      { name: 'Fitness', url: 'https://www.scouting.org/merit-badges/fitness/' },
      { name: 'Physical Fitness', url: 'https://www.scouting.org/merit-badges/personal-fitness/' },
      { name: 'Skating', url: 'https://www.scouting.org/merit-badges/skating/' },
      { name: 'Snow Sports', url: 'https://www.scouting.org/merit-badges/snow-sports/' },
      { name: 'Golf', url: 'https://www.scouting.org/merit-badges/golf/' },
      { name: 'Horsemanship', url: 'https://www.scouting.org/merit-badges/horsemanship/' },
      { name: 'Hang Gliding', url: 'https://www.scouting.org/merit-badges/hang-gliding/' }
    ]
  },
  {
    category: 'Outdoor Skills & Camping',
    emoji: '🏕️',
    description: 'Master camping, hiking, and outdoor survival',
    badges: [
      { name: 'Camping', url: 'https://www.scouting.org/merit-badges/camping/' },
      { name: 'Hiking', url: 'https://www.scouting.org/merit-badges/hiking/' },
      { name: 'Backpacking', url: 'https://www.scouting.org/merit-badges/backpacking/' },
      { name: 'Cooking', url: 'https://www.scouting.org/merit-badges/cooking/' },
      { name: 'Fire Safety', url: 'https://www.scouting.org/merit-badges/fire-safety/' },
      { name: 'Wilderness Survival', url: 'https://www.scouting.org/merit-badges/wilderness-survival-skills/' },
      { name: 'Orienteering', url: 'https://www.scouting.org/merit-badges/orienteering/' },
      { name: 'Pioneering', url: 'https://www.scouting.org/merit-badges/pioneering/' },
      { name: 'Soil and Water Conservation', url: 'https://www.scouting.org/merit-badges/soil-and-water-conservation/' },
      { name: 'Gardening', url: 'https://www.scouting.org/merit-badges/gardening/' },
      { name: 'Forestry', url: 'https://www.scouting.org/merit-badges/forestry/' },
      { name: 'Weather', url: 'https://www.scouting.org/merit-badges/weather/' },
      { name: 'Whitewater Rafting', url: 'https://www.scouting.org/merit-badges/whitewater/' },
      { name: 'Snowsports', url: 'https://www.scouting.org/merit-badges/snow-sports/' }
    ]
  },
  {
    category: 'Water Activities',
    emoji: '🚣',
    description: 'Master water-based skills and adventures',
    badges: [
      { name: 'Kayaking', url: 'https://www.scouting.org/merit-badges/kayaking/' },
      { name: 'Canoeing', url: 'https://www.scouting.org/merit-badges/canoeing/' },
      { name: 'Small-Boat Sailing', url: 'https://www.scouting.org/merit-badges/small-boat-sailing/' },
      { name: 'Swimming', url: 'https://www.scouting.org/merit-badges/swimming/' },
      { name: 'Scuba Diving', url: 'https://www.scouting.org/merit-badges/scuba-diving/' },
      { name: 'Lifesaving', url: 'https://www.scouting.org/merit-badges/lifesaving/' },
      { name: 'Motorboating', url: 'https://www.scouting.org/merit-badges/motorboating/' },
      { name: 'Rowing', url: 'https://www.scouting.org/merit-badges/rowing/' },
      { name: 'Fishing', url: 'https://www.scouting.org/merit-badges/fishing/' },
      { name: 'Fly Fishing', url: 'https://www.scouting.org/merit-badges/fly-fishing/' },
      { name: 'Fish & Wildlife Management', url: 'https://www.scouting.org/merit-badges/fish-and-wildlife-management/' },
      { name: 'Snorkeling', url: 'https://www.scouting.org/merit-badges/snorkeling/' },
      { name: 'Surfing', url: 'https://www.scouting.org/merit-badges/surfing/' },
      { name: 'Water Skiing', url: 'https://www.scouting.org/merit-badges/water-skiing/' }
    ]
  },
  {
    category: 'Adventure & Climbing',
    emoji: '🧗',
    description: 'Challenge yourself with exciting adventures',
    badges: [
      { name: 'Climbing', url: 'https://www.scouting.org/merit-badges/climbing/' },
      { name: 'Geocaching', url: 'https://www.scouting.org/merit-badges/geocaching/' },
      { name: 'Whitewater', url: 'https://www.scouting.org/merit-badges/whitewater/' },
      { name: 'Bugling', url: 'https://www.scouting.org/merit-badges/bugling/' },
      { name: 'Signs, Signals, and Codes', url: 'https://www.scouting.org/merit-badges/signs-signals-and-codes/' },
      { name: 'Scouting Heritage', url: 'https://www.scouting.org/merit-badges/scouting-heritage/' },
      { name: 'Search and Rescue', url: 'https://www.scouting.org/merit-badges/search-and-rescue/' },
      { name: 'Rappelling', url: 'https://www.scouting.org/merit-badges/rappelling/' },
      { name: 'Skydiving', url: 'https://www.scouting.org/merit-badges/skydiving/' },
      { name: 'Scuba Diving', url: 'https://www.scouting.org/merit-badges/scuba-diving/' }
    ]
  },
  {
    category: 'Technology & Digital',
    emoji: '💻',
    description: 'Develop skills in modern technology',
    badges: [
      { name: 'Programming', url: 'https://www.scouting.org/merit-badges/programming/' },
      { name: 'Robotics', url: 'https://www.scouting.org/merit-badges/robotics/' },
      { name: 'Artificial Intelligence', url: 'https://www.scouting.org/merit-badges/artificial-intelligence/' },
      { name: 'Digital Technology', url: 'https://www.scouting.org/merit-badges/digital-technology/' },
      { name: 'Electronics', url: 'https://www.scouting.org/merit-badges/electronics/' },
      { name: 'Cybersecurity', url: 'https://www.scouting.org/merit-badges/cybersecurity/' },
      { name: 'Radio', url: 'https://www.scouting.org/merit-badges/radio/' },
      { name: 'Game Design', url: 'https://www.scouting.org/merit-badges/game-design/' },
      { name: 'Moviemaking', url: 'https://www.scouting.org/merit-badges/moviemaking/' },
      { name: 'Photography', url: 'https://www.scouting.org/merit-badges/photography/' },
      { name: 'Coding', url: 'https://www.scouting.org/merit-badges/coding/' },
      { name: '3D Printing', url: 'https://www.scouting.org/merit-badges/3d-printing/' },
      { name: 'Drone Technology', url: 'https://www.scouting.org/merit-badges/drone-technology/' },
      { name: 'Masonry', url: 'https://www.scouting.org/merit-badges/masonry/' }
    ]
  },
  {
    category: 'Science & Nature',
    emoji: '🔬',
    description: 'Explore the natural and scientific world',
    badges: [
      { name: 'Environmental Science', url: 'https://www.scouting.org/merit-badges/environmental-science/' },
      { name: 'Astronomy', url: 'https://www.scouting.org/merit-badges/astronomy/' },
      { name: 'Space Exploration', url: 'https://www.scouting.org/merit-badges/space-exploration/' },
      { name: 'Chemistry', url: 'https://www.scouting.org/merit-badges/chemistry/' },
      { name: 'Geology', url: 'https://www.scouting.org/merit-badges/geology/' },
      { name: 'Oceanography', url: 'https://www.scouting.org/merit-badges/oceanography/' },
      { name: 'Weather', url: 'https://www.scouting.org/merit-badges/weather/' },
      { name: 'Plant Science', url: 'https://www.scouting.org/merit-badges/plant-science/' },
      { name: 'Botany', url: 'https://www.scouting.org/merit-badges/botany/' },
      { name: 'Zoology', url: 'https://www.scouting.org/merit-badges/zoology/' },
      { name: 'Bird Study', url: 'https://www.scouting.org/merit-badges/bird-study/' },
      { name: 'Mammal Study', url: 'https://www.scouting.org/merit-badges/mammal-study/' },
      { name: 'Insect Study', url: 'https://www.scouting.org/merit-badges/insect-study/' },
      { name: 'Reptile and Amphibian Study', url: 'https://www.scouting.org/merit-badges/reptile-and-amphibian-study/' },
      { name: 'Nature', url: 'https://www.scouting.org/merit-badges/nature/' },
      { name: 'Microbiology', url: 'https://www.scouting.org/merit-badges/microbiology/' },
      { name: 'Physics', url: 'https://www.scouting.org/merit-badges/physics/' },
      { name: 'Paleontology', url: 'https://www.scouting.org/merit-badges/paleontology/' },
      { name: 'Water Safety', url: 'https://www.scouting.org/merit-badges/water-safety/' }
    ]
  },
  {
    category: 'Career Exploration',
    emoji: '🎯',
    description: 'Discover careers and professional paths',
    badges: [
      { name: 'Engineering', url: 'https://www.scouting.org/merit-badges/engineering/' },
      { name: 'Architecture', url: 'https://www.scouting.org/merit-badges/architecture/' },
      { name: 'Construction', url: 'https://www.scouting.org/merit-badges/construction/' },
      { name: 'Plumbing', url: 'https://www.scouting.org/merit-badges/plumbing/' },
      { name: 'Automotive Maintenance', url: 'https://www.scouting.org/merit-badges/automotive-maintenance/' },
      { name: 'Welding', url: 'https://www.scouting.org/merit-badges/welding/' },
      { name: 'Electricity', url: 'https://www.scouting.org/merit-badges/electricity/' },
      { name: 'Farm Mechanics', url: 'https://www.scouting.org/merit-badges/farm-mechanics/' },
      { name: 'Landscape Architecture', url: 'https://www.scouting.org/merit-badges/landscape-architecture/' },
      { name: 'Law', url: 'https://www.scouting.org/merit-badges/law/' },
      { name: 'Medicine', url: 'https://www.scouting.org/merit-badges/medicine/' },
      { name: 'Health Care Professions', url: 'https://www.scouting.org/merit-badges/health-care-professions/' },
      { name: 'Public Health', url: 'https://www.scouting.org/merit-badges/public-health/' },
      { name: 'Dentistry', url: 'https://www.scouting.org/merit-badges/dentistry/' },
      { name: 'Veterinary Medicine', url: 'https://www.scouting.org/merit-badges/veterinary-medicine/' },
      { name: 'Teaching', url: 'https://www.scouting.org/merit-badges/teaching/' },
      { name: 'Surveying', url: 'https://www.scouting.org/merit-badges/surveying/' },
      { name: 'Railroading', url: 'https://www.scouting.org/merit-badges/railroading/' },
      { name: 'Truck Transportation', url: 'https://www.scouting.org/merit-badges/truck-transportation/' },
      { name: 'Military Service', url: 'https://www.scouting.org/merit-badges/military-service/' },
      { name: 'Farmer', url: 'https://www.scouting.org/merit-badges/farming/' },
      { name: 'Horticulture', url: 'https://www.scouting.org/merit-badges/horticulture/' },
      { name: 'Environmental Conservation', url: 'https://www.scouting.org/merit-badges/environmental-conservation/' },
      { name: 'Aviation', url: 'https://www.scouting.org/merit-badges/aviation/' },
      { name: 'Automotive Repair', url: 'https://www.scouting.org/merit-badges/automotive-repair/' }
    ]
  },
];

const BEGINNER_BADGES = ['Cooking', 'Camping', 'First Aid', 'Pets', 'Collections', 'Photography', 'Fingerprinting', 'Communication', 'Chess', 'Reading'];

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
                      {catItem.badges.map((badge, j) => {
                        const isBeginnerBadge = BEGINNER_BADGES.includes(badge.name);
                        return (
                          <motion.div key={j} style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}>
                            <motion.a
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
                                flex: 1,
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
                            {isBeginnerBadge && (
                              <div style={{
                                position: 'absolute',
                                top: -8,
                                right: 20,
                                background: '#10b981',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                Beginner
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
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
