import { useState } from 'react';
import '../styles/CampingGuide.css';

// Performance Optimization (Bolt ⚡): Hoist static data structures out of component scope
// to eliminate unnecessary object allocations and GC overhead on state changes/re-renders.
const CAMPING_CHECKLIST = [
  {
    category: 'Shelter & Sleep',
    items: [
      '✓ Tent with rainfly and stakes',
      '✓ Sleeping bag (appropriate for season)',
      '✓ Sleeping pad or mattress',
      '✓ Pillow or camp pillow',
      '✓ Ground tarp',
    ]
  },
  {
    category: 'Clothing & Personal',
    items: [
      '✓ Weather-appropriate clothing layers',
      '✓ Rain jacket & rain pants',
      '✓ Sturdy hiking boots/shoes',
      '✓ Warm hat and gloves (if cold)',
      '✓ Extra socks and underwear',
      '✓ Toiletries & medications',
      '✓ Sunscreen & insect repellent',
      '✓ Headlamp or flashlight with batteries',
    ]
  },
  {
    category: 'Cooking & Food',
    items: [
      '✓ Camp stove or grill',
      '✓ Cookware (pots, pans, utensils)',
      '✓ Dishes, cups, and cutlery',
      '✓ Cooler with ice/ice packs',
      '✓ Food storage containers',
      '✓ Water bottles or hydration system',
      '✓ Lighter or waterproof matches',
      '✓ Cooktop fuel or firewood',
    ]
  },
  {
    category: 'Safety & Navigation',
    items: [
      '✓ First aid kit',
      '✓ Map and compass',
      '✓ Emergency whistle',
      '✓ Multi-tool or knife',
      '✓ Rope or paracord',
      '✓ Emergency contact information',
      '✓ Identification documents',
    ]
  },
  {
    category: 'Recreation',
    items: [
      '✓ Binoculars for bird watching',
      '✓ Camera or smartphone',
      '✓ Playing cards or board games',
      '✓ Books or journal',
      '✓ Fishing gear (if applicable)',
    ]
  }
];

const BEST_PRACTICES = [
  {
    title: 'Leave No Trace',
    tips: [
      'Pack out all trash - leave the campsite cleaner than you found it',
      'Use biodegradable soap and wash dishes away from water sources',
      'Stay on designated trails to prevent vegetation damage',
      'Never feed wildlife - keep food secure in bear canisters or hung properly',
      'Use established fire rings or camp stoves instead of making new fires',
    ]
  },
  {
    title: 'Fire Safety',
    tips: [
      'Never leave a fire unattended',
      'Keep fires at least 15 feet from tents and vegetation',
      'Completely extinguish fires with water before sleeping',
      'Check fire bans and regulations in your area',
      'Stir ashes to ensure no hot spots remain',
    ]
  },
  {
    title: 'Water Safety',
    tips: [
      'Always treat water before drinking - boil, filter, or use purification tablets',
      'Never drink directly from streams or lakes',
      'Set up camp at least 200 feet away from water sources',
      'Maintain proper hygiene to prevent waterborne illnesses',
      'Carry sufficient water for all needs',
    ]
  },
  {
    title: 'Wildlife Awareness',
    tips: [
      'Make noise while hiking to avoid surprising animals',
      'Store food in bear canisters or hang it properly',
      'Never approach or feed wildlife',
      'Identify dangerous animals in your area and know what to do',
      'Keep a safe distance from all animals (50+ yards)',
    ]
  },
  {
    title: 'Weather Preparedness',
    tips: [
      'Check weather forecasts before departing',
      'Bring weather-appropriate gear and extra layers',
      'Know how to set up your tent for high winds and rain',
      'Monitor weather conditions and be ready to move if necessary',
      'Know the signs of hypothermia and heat exhaustion',
    ]
  },
  {
    title: 'Navigation & Security',
    tips: [
      'Tell someone where you\'re going and when you\'ll return',
      'Carry a map, compass, and GPS device',
      'Mark your campsite so you can find your way back',
      'Establish a buddy system - never camp alone',
      'Know the emergency procedures for your campground',
    ]
  }
];

export default function CampingGuide() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="camping-guide">
      {/* Hero Section */}
      <div className="camping-hero">
        <img
          src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&h=600&fit=crop"
          alt="Beautiful camping scene at sunset with tents by a river"
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>🏕️ Troop 242 Camping Guide</h1>
            <p>Master the essentials and enjoy the great outdoors safely</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="camping-content">
        {/* Introduction */}
        <section className="intro-section">
          <h2>Welcome to Camping Adventure</h2>
          <p>
            Camping is one of the greatest outdoor experiences available to Scouts. Whether you're sleeping
            under the stars for the first time or you're a seasoned camper, this guide will help you prepare
            for a safe and enjoyable camping experience.
          </p>
          <p>
            At Troop 242, we believe in the outdoor code: Leave No Trace, respect nature, and practice safety
            above all else. This comprehensive guide covers everything you need to know before hitting the trail.
          </p>
        </section>

        {/* Camping Checklist */}
        <section className="checklist-section">
          <h2>📋 Complete Camping Checklist</h2>
          <p className="section-intro">Use this checklist to ensure you have everything needed for a comfortable camping trip.</p>

          <div className="official-resource">
            <p>📖 For the official BSA camping checklist, visit:
              <a href="https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/camping/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="resource-link">
                Scouting.org Camping Resources
              </a>
            </p>
          </div>

          <div className="checklist-container">
            {CAMPING_CHECKLIST.map((section, idx) => (
              <div key={idx} className="checklist-item">
                <button
                  className="checklist-header"
                  onClick={() => toggleSection(idx)}
                >
                  <span className="toggle-icon">
                    {expandedSection === idx ? '▼' : '▶'}
                  </span>
                  <h3>{section.category}</h3>
                </button>

                {expandedSection === idx && (
                  <div className="checklist-content">
                    <ul>
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="best-practices-section">
          <h2>⭐ Best Practices & Safety Tips</h2>
          <p className="section-intro">Follow these guidelines to ensure a safe and responsible camping experience.</p>

          <div className="practices-grid">
            {BEST_PRACTICES.map((practice, idx) => (
              <div key={idx} className="practice-card">
                <h3>{practice.title}</h3>
                <ul>
                  {practice.tips.map((tip, tipIdx) => (
                    <li key={tipIdx}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Essential Tips */}
        <section className="tips-section">
          <h2>💡 Quick Tips for Success</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🔥</div>
              <h4>Fire Management</h4>
              <p>Always follow local fire regulations and completely extinguish fires before bed.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💧</div>
              <h4>Hydration</h4>
              <p>Drink plenty of water throughout the day, especially during physical activities.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🌙</div>
              <h4>Sleep Schedule</h4>
              <p>Get adequate rest to maintain energy and mental clarity while camping.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🧭</div>
              <h4>Navigation</h4>
              <p>Always carry maps and a compass, and know your location at all times.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🏥</div>
              <h4>First Aid</h4>
              <p>Know basic first aid and carry a well-stocked first aid kit at all times.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h4>Buddy System</h4>
              <p>Never camp or hike alone. Always have a buddy and know everyone's location.</p>
            </div>
          </div>
        </section>

        {/* Camping Ethics */}
        <section className="ethics-section">
          <h2>🌿 Camping Ethics & Outdoor Responsibility</h2>
          <div className="ethics-content">
            <h3>The Scout Oath in the Outdoors</h3>
            <p>
              As Scouts, we are committed to respecting nature and protecting our environment. When camping,
              follow the principles of Leave No Trace and ensure that the wilderness is preserved for future
              generations.
            </p>
            <h3>Environmental Stewardship</h3>
            <ul className="ethics-list">
              <li><strong>Minimize Impact:</strong> Camp only in designated areas and avoid sensitive ecosystems.</li>
              <li><strong>Proper Waste Management:</strong> Pack out all trash, including food scraps and biodegradable items.</li>
              <li><strong>Respect Wildlife:</strong> Observe animals from a distance and never feed them.</li>
              <li><strong>Conserve Resources:</strong> Use water wisely and minimize energy consumption.</li>
              <li><strong>Follow Regulations:</strong> Adhere to all campground rules and local regulations.</li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h2>Ready to Camp?</h2>
          <p>
            Prepare with this checklist, review the best practices, and get ready for an unforgettable
            camping adventure with Troop 242!
          </p>
          <div className="cta-buttons">
            <a href="mailto:troop242sanford@gmail.com" className="btn btn-primary">
              📧 Contact Scoutmaster
            </a>
            <button className="btn btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to Top
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
