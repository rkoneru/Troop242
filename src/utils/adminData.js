/**
 * Admin data storage and retrieval — Firestore-backed
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Default values for initial setup
export const DEFAULT_STATS = {
  eagleScouts: '20+',
  activeScouts: '34+',
  yearsServing: '25'
};

export const DEFAULT_EVENTS = [];
export const DEFAULT_ANNOUNCEMENTS = [];

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

/**
 * Load troop data (stats, leaders, announcements)
 * @param {string} field - field name ('stats', 'leaders', 'announcements')
 * @param {*} fallback - fallback value if load fails
 * @returns {Promise<*>} - stored value or fallback
 */
export async function loadTroopData(field, fallback) {
  try {
    const snap = await getDoc(doc(db, 'troop', 'settings'));
    if (!snap.exists()) return fallback;

    const data = snap.data()[field];
    return data || fallback;
  } catch (error) {
    console.error(`Error loading troop data (${field}):`, error);
    return fallback;
  }
}

/**
 * Save troop data
 * @param {string} field - field name
 * @param {*} value - value to save
 */
export async function saveTroopData(field, value) {
  try {
    await setDoc(
      doc(db, 'troop', 'settings'),
      { [field]: value },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error saving troop data (${field}):`, error);
    throw error;
  }
}

/**
 * Get all events
 * @returns {Promise<Array>} - array of event objects
 */
export async function getEvents() {
  try {
    const snap = await getDocs(
      query(collection(db, 'events'), orderBy('date', 'desc'))
    );
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

/**
 * Save event
 * @param {object} event - event data
 * @returns {Promise<string>} - event ID
 */
export async function saveEvent(event) {
  try {
    if (event.id) {
      // Update existing
      await updateDoc(doc(db, 'events', event.id), {
        ...event,
        updatedAt: Timestamp.now()
      });
      return event.id;
    } else {
      // Create new
      const docRef = await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
}

/**
 * Delete event
 * @param {string} eventId - event ID to delete
 */
export async function deleteEvent(eventId) {
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * Get all announcements
 * @returns {Promise<Array>} - array of announcement objects
 */
export async function getAnnouncements() {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'announcements'),
        orderBy('createdAt', 'desc')
      )
    );
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error loading announcements:', error);
    return [];
  }
}

/**
 * Save announcement
 * @param {object} announcement - announcement data
 * @returns {Promise<string>} - announcement ID
 */
export async function saveAnnouncement(announcement) {
  try {
    if (announcement.id) {
      // Update existing
      await updateDoc(doc(db, 'announcements', announcement.id), {
        ...announcement,
        updatedAt: Timestamp.now()
      });
      return announcement.id;
    } else {
      // Create new
      const docRef = await addDoc(collection(db, 'announcements'), {
        ...announcement,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving announcement:', error);
    throw error;
  }
}

/**
 * Delete announcement
 * @param {string} announcementId - announcement ID to delete
 */
export async function deleteAnnouncement(announcementId) {
  try {
    await deleteDoc(doc(db, 'announcements', announcementId));
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
}

/**
 * Load data from localStorage with fallback (for UI preferences like theme)
 * Used by Home.jsx and other pages that need quick local access
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
 * Used for UI preferences (theme, appearance settings, etc.)
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
 * Generate unique ID for new items using Web Crypto API
 */
export function generateId() {
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  const randomHex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return `item-${Date.now()}-${randomHex}`;
}

/**
 * Load all activities (both activities and events) from Firestore
 */
export async function getActivities() {
  const snap = await getDocs(query(collection(db, 'activities'), orderBy('date', 'asc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), signedUp: d.data().signedUp || [] }));
}

/**
 * Save or update an activity in Firestore
 * @param {*} activityData - activity object. If it has an id field, updates; otherwise creates new
 */
export async function saveActivity(activityData) {
  if (activityData.id) {
    const { id, ...rest } = activityData;
    await updateDoc(doc(db, 'activities', id), { ...rest, updatedAt: Timestamp.now() });
    return id;
  } else {
    const ref = await addDoc(collection(db, 'activities'), {
      ...activityData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return ref.id;
  }
}

/**
 * Delete an activity from Firestore
 */
export async function deleteActivity(activityId) {
  await deleteDoc(doc(db, 'activities', activityId));
}

/**
 * Initialize troop settings document if it doesn't exist
 */
export async function initializeTroopSettings() {
  try {
    const snap = await getDoc(doc(db, 'troop', 'settings'));
    if (!snap.exists()) {
      // Create troop/settings with default values
      await setDoc(doc(db, 'troop', 'settings'), {
        stats: DEFAULT_STATS,
        createdAt: Timestamp.now()
      });
      console.log('✓ Initialized troop/settings with default stats');
    }
  } catch (error) {
    console.error('Error initializing troop settings:', error);
  }
}
