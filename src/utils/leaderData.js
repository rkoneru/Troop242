/**
 * Leader Dashboard Data Persistence Utilities
 * Handles scout data, activities, events, and invitations
 */

export const DEFAULT_SCOUTS = [];

/**
 * Load scouts from localStorage with fallback and error recovery
 * @param {string} key - localStorage key
 * @param {array} fallback - default value if load fails
 * @returns {array} - scouts array
 */
export function loadScouts(key = 'leaderScouts', fallback = DEFAULT_SCOUTS) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return fallback;

    return parsed.map(scout => ({
      id: scout.id || Date.now(),
      name: scout.name || 'Unknown',
      email: scout.email || '',
      rank: scout.rank || 'Scout',
      activities: Array.isArray(scout.activities) ? scout.activities : [],
      status: scout.status || 'pending',
      joinDate: scout.joinDate || new Date().toISOString().split('T')[0],
      notes: scout.notes || '',
      phone: scout.phone || '',
      createdAt: scout.createdAt || new Date().toISOString()
    }));
  } catch (error) {
    console.error(`Failed to load scouts from ${key}:`, error);
    return fallback;
  }
}

/**
 * Save scouts to localStorage atomically
 * @param {array} scouts - scouts data to save
 * @param {string} key - localStorage key
 * @returns {boolean} - success status
 */
export function saveScouts(scouts, key = 'leaderScouts') {
  try {
    if (!Array.isArray(scouts)) {
      console.error('Invalid scouts data: not an array');
      return false;
    }
    localStorage.setItem(key, JSON.stringify(scouts));
    return true;
  } catch (error) {
    console.error(`Failed to save scouts to ${key}:`, error);
    return false;
  }
}

/**
 * Add a new scout
 * @param {object} scout - scout data
 * @param {array} scouts - current scouts array
 * @returns {array} - updated scouts array
 */
export function addScout(scout, scouts = []) {
  const newScout = {
    id: scout.id || Date.now(),
    name: scout.name || 'Unknown',
    email: scout.email || '',
    rank: scout.rank || 'Scout',
    activities: scout.activities || [],
    status: scout.status || 'pending',
    joinDate: scout.joinDate || new Date().toISOString().split('T')[0],
    notes: scout.notes || '',
    phone: scout.phone || '',
    createdAt: scout.createdAt || new Date().toISOString()
  };
  return [...scouts, newScout];
}

/**
 * Update an existing scout
 * @param {number|string} scoutId - scout ID to update
 * @param {object} changes - fields to update
 * @param {array} scouts - current scouts array
 * @returns {array} - updated scouts array
 */
export function updateScout(scoutId, changes, scouts = []) {
  return scouts.map(scout =>
    scout.id === scoutId ? { ...scout, ...changes, id: scout.id } : scout
  );
}

/**
 * Delete a scout
 * @param {number|string} scoutId - scout ID to delete
 * @param {array} scouts - current scouts array
 * @returns {array} - updated scouts array
 */
export function deleteScout(scoutId, scouts = []) {
  return scouts.filter(scout => scout.id !== scoutId);
}

/**
 * Get a single scout by ID
 * @param {number|string} scoutId - scout ID to find
 * @param {array} scouts - scouts array
 * @returns {object|null} - scout object or null
 */
export function getScoutById(scoutId, scouts = []) {
  return scouts.find(scout => scout.id === scoutId) || null;
}

/**
 * Get scouts by status (approved, pending, rejected)
 * @param {string} status - status to filter by
 * @param {array} scouts - scouts array
 * @returns {array} - filtered scouts
 */
export function getScoutsByStatus(status, scouts = []) {
  return scouts.filter(scout => scout.status === status);
}

/**
 * Get scouts by activity
 * @param {string} activity - activity name
 * @param {array} scouts - scouts array
 * @returns {array} - scouts in that activity
 */
export function getScoutsByActivity(activity, scouts = []) {
  return scouts.filter(scout =>
    Array.isArray(scout.activities) && scout.activities.includes(activity)
  );
}

/**
 * Search scouts by name, email, or rank
 * @param {string} query - search query
 * @param {array} scouts - scouts array
 * @returns {array} - matching scouts
 */
export function searchScouts(query, scouts = []) {
  const q = query.toLowerCase().trim();
  if (!q) return scouts;

  return scouts.filter(scout =>
    scout.name.toLowerCase().includes(q) ||
    scout.email.toLowerCase().includes(q) ||
    scout.rank.toLowerCase().includes(q) ||
    scout.phone.includes(q)
  );
}

/**
 * Export scouts data to JSON string (for backup/download)
 * @param {array} scouts - scouts to export
 * @returns {string} - JSON string
 */
export function exportScoutData(scouts = []) {
  try {
    return JSON.stringify(scouts, null, 2);
  } catch (error) {
    console.error('Failed to export scout data:', error);
    return null;
  }
}

/**
 * Import scouts from JSON string (with validation)
 * @param {string} jsonString - JSON data to import
 * @returns {object} - { scouts: array, errors: array }
 */
export function importScoutData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { scouts: [], errors: ['Data is not an array'] };
    }

    const errors = [];
    const scouts = parsed.map((scout, idx) => {
      if (!scout.name) errors.push(`Row ${idx + 1}: Missing name`);
      return {
        id: scout.id || Date.now() + idx,
        name: scout.name || 'Unknown',
        email: scout.email || '',
        rank: scout.rank || 'Scout',
        activities: scout.activities || [],
        status: scout.status || 'pending',
        joinDate: scout.joinDate || new Date().toISOString().split('T')[0],
        notes: scout.notes || '',
        phone: scout.phone || '',
        createdAt: scout.createdAt || new Date().toISOString()
      };
    });

    return { scouts, errors };
  } catch (error) {
    return { scouts: [], errors: [error.message] };
  }
}

/**
 * Clear old data from localStorage (older than X days)
 * @param {number} days - days threshold
 * @param {string} key - localStorage key
 * @returns {boolean} - success status
 */
export function clearOldData(days = 90, key = 'leaderScouts') {
  try {
    const scouts = loadScouts(key, []);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = scouts.filter(scout => {
      const scoutDate = new Date(scout.createdAt);
      return scoutDate > cutoffDate;
    });

    return saveScouts(filtered, key);
  } catch (error) {
    console.error('Failed to clear old data:', error);
    return false;
  }
}

/**
 * Get statistics about scouts
 * @param {array} scouts - scouts array
 * @returns {object} - stats object
 */
export function getScoutStats(scouts = []) {
  const approved = scouts.filter(s => s.status === 'approved').length;
  const pending = scouts.filter(s => s.status === 'pending').length;
  const ranks = {};

  scouts.forEach(scout => {
    ranks[scout.rank] = (ranks[scout.rank] || 0) + 1;
  });

  return {
    total: scouts.length,
    approved,
    pending,
    rejection: scouts.length - approved - pending,
    ranks,
    approvalRate: scouts.length > 0 ? Math.round((approved / scouts.length) * 100) : 0
  };
}

/**
 * Generate unique ID for scouts
 * @returns {number} - unique timestamp-based ID
 */
export function generateScoutId() {
  return Date.now();
}
