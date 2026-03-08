// Admin data storage and retrieval helpers

export const DEFAULT_STATS = {
  eagleScouts: '25+',
  activeScouts: '50+',
  yearsServing: '20'
};

export const DEFAULT_LEADERS = [
  {
    id: 'leader-1',
    role: 'Scoutmaster',
    name: 'Rich Lester',
    experience: '20+ years in scouting',
    bio: 'Dedicated to developing the next generation of leaders through outdoor skills and mentorship.'
  },
  {
    id: 'leader-2',
    role: 'Assistant Scoutmaster',
    name: 'Mike',
    experience: '15+ years in scouting',
    bio: 'Passionate about creating inclusive experiences for all scouts and fostering outdoor adventures.'
  },
  {
    id: 'leader-3',
    role: 'Assistant Scoutmaster',
    name: 'Mike',
    experience: '12+ years in scouting',
    bio: 'Focused on merit badge programs and helping scouts achieve their advancement goals.'
  },
  {
    id: 'leader-4',
    role: 'Advancement Chair',
    name: 'Mike',
    experience: '10+ years in scouting',
    bio: 'Manages rank advancement and ensures scouts have clear paths to Eagle Scout.'
  },
  {
    id: 'leader-5',
    role: 'Treasurer',
    name: 'Bridget Kroll',
    experience: '8+ years in scouting',
    bio: 'Oversees troop finances and ensures resources are available for programs and activities.'
  },
  {
    id: 'leader-6',
    role: 'Outdoor Activities Director',
    name: 'Felicia Griffin',
    experience: '14+ years in scouting',
    bio: 'Plans and coordinates all campouts, hikes, and outdoor experiences for the troop.'
  }
];

export const DEFAULT_EVENTS = [];

export const DEFAULT_ANNOUNCEMENTS = [];

/**
 * Load data from localStorage with fallback
 * @param {string} key - localStorage key
 * @param {*} fallback - fallback value if key not found or parse fails
 * @returns {*} stored value or fallback
 */
export function loadData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error loading data for ${key}:`, error);
    return fallback;
  }
}

/**
 * Save data to localStorage
 * @param {string} key - localStorage key
 * @param {*} value - value to store
 */
export function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving data for ${key}:`, error);
  }
}

/**
 * Generate unique ID for new items
 */
export function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
