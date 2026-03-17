/**
 * Leader Dashboard Data Persistence Utilities
 * Handles scout data, activities, events, and invitations via Firestore
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const DEFAULT_SCOUTS = [];

/**
 * Load scouts from Firestore
 * @returns {Promise<Array>} - scouts array
 */
export async function loadScouts() {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'users'),
        where('role', '==', 'scout'),
        orderBy('name')
      )
    );
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Failed to load scouts:', error);
    return DEFAULT_SCOUTS;
  }
}

/**
 * Save scout to Firestore
 * @param {object} scout - scout data
 * @returns {Promise<boolean>} - success status
 */
export async function saveScout(scout) {
  try {
    if (!scout.id) {
      console.error('Invalid scout data: missing id');
      return false;
    }

    await setDoc(
      doc(db, 'users', scout.id),
      {
        ...scout,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Failed to save scout:', error);
    return false;
  }
}

/**
 * Update a scout's fields
 * @param {string} scoutId - scout ID (Firebase UID)
 * @param {object} changes - fields to update
 * @returns {Promise<boolean>} - success status
 */
export async function updateScout(scoutId, changes) {
  try {
    await updateDoc(doc(db, 'users', scoutId), {
      ...changes,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Failed to update scout:', error);
    return false;
  }
}

/**
 * Delete a scout
 * @param {string} scoutId - scout ID to delete
 * @returns {Promise<boolean>} - success status
 */
export async function deleteScout(scoutId) {
  try {
    await deleteDoc(doc(db, 'users', scoutId));
    return true;
  } catch (error) {
    console.error('Failed to delete scout:', error);
    return false;
  }
}

/**
 * Get a single scout by ID
 * @param {string} scoutId - scout ID to find
 * @returns {Promise<object|null>} - scout object or null
 */
export async function getScoutById(scoutId) {
  try {
    const snap = await getDoc(doc(db, 'users', scoutId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('Failed to get scout:', error);
    return null;
  }
}

/**
 * Get scouts by status (approved, pending, rejected)
 * @param {string} status - status to filter by
 * @returns {Promise<Array>} - filtered scouts
 */
export async function getScoutsByStatus(status) {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'users'),
        where('role', '==', 'scout'),
        where('status', '==', status)
      )
    );
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to get scouts by status:', error);
    return [];
  }
}

/**
 * Get scouts by activity
 * @param {string} activity - activity name
 * @returns {Promise<Array>} - scouts in that activity
 */
export async function getScoutsByActivity(activity) {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'users'),
        where('role', '==', 'scout'),
        where('activities', 'array-contains', activity)
      )
    );
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to get scouts by activity:', error);
    return [];
  }
}

/**
 * Search scouts by name, email, or rank
 * Note: Full-text search requires Firestore full-text search or Algolia
 * This is a client-side filter of all scouts
 * @param {string} query - search query
 * @returns {Promise<Array>} - matching scouts
 */
export async function searchScouts(searchQuery) {
  try {
    const scouts = await loadScouts();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return scouts;

    return scouts.filter(scout =>
      scout.name?.toLowerCase().includes(q) ||
      scout.email?.toLowerCase().includes(q) ||
      scout.rank?.toLowerCase().includes(q) ||
      scout.phone?.includes(q)
    );
  } catch (error) {
    console.error('Failed to search scouts:', error);
    return [];
  }
}

/**
 * Get statistics about scouts
 * @returns {Promise<object>} - stats object
 */
export async function getScoutStats() {
  try {
    const scouts = await loadScouts();
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
      rejected: scouts.length - approved - pending,
      ranks,
      approvalRate: scouts.length > 0 ? Math.round((approved / scouts.length) * 100) : 0
    };
  } catch (error) {
    console.error('Failed to get scout stats:', error);
    return {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      ranks: {},
      approvalRate: 0
    };
  }
}

/**
 * Get all activities
 * @returns {Promise<Array>} - activities array
 */
export async function getActivities() {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'activities'),
        orderBy('date', 'desc')
      )
    );
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to load activities:', error);
    return [];
  }
}

/**
 * Save scouts to Firestore (batch operation or single scout array)
 * @param {array} scouts - scouts data to save
 * @returns {Promise<boolean>} - success status
 */
export async function saveScouts(scouts) {
  try {
    if (!Array.isArray(scouts)) {
      console.error('Invalid scouts data: not an array');
      return false;
    }

    // Save each scout individually
    for (const scout of scouts) {
      if (scout.id) {
        await setDoc(
          doc(db, 'users', scout.id),
          {
            ...scout,
            updatedAt: Timestamp.now()
          },
          { merge: true }
        );
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to save scouts:', error);
    return false;
  }
}

/**
 * Save activity
 * @param {object} activity - activity data
 * @returns {Promise<string>} - activity ID
 */
export async function saveActivity(activity) {
  try {
    if (activity.id) {
      await updateDoc(doc(db, 'activities', activity.id), {
        ...activity,
        updatedAt: Timestamp.now()
      });
      return activity.id;
    } else {
      const docRef = await setDoc(
        collection(db, 'activities'),
        {
          ...activity,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }
      );
      return docRef.id;
    }
  } catch (error) {
    console.error('Failed to save activity:', error);
    throw error;
  }
}

/**
 * Delete activity
 * @param {string} activityId - activity ID to delete
 */
export async function deleteActivity(activityId) {
  try {
    await deleteDoc(doc(db, 'activities', activityId));
  } catch (error) {
    console.error('Failed to delete activity:', error);
    throw error;
  }
}

/**
 * Get invitations
 * @returns {Promise<Array>} - invitations array
 */
export async function getInvitations() {
  try {
    const snap = await getDocs(collection(db, 'invitations'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to load invitations:', error);
    return [];
  }
}

/**
 * Create invitation
 * @param {object} invitation - invitation data
 * @returns {Promise<string>} - invitation ID
 */
export async function createInvitation(invitation) {
  try {
    const docRef = await setDoc(
      collection(db, 'invitations'),
      {
        ...invitation,
        createdAt: Timestamp.now()
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('Failed to create invitation:', error);
    throw error;
  }
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
 * Generate unique ID for scouts
 * @returns {string} - unique timestamp-based ID
 */
export function generateScoutId() {
  return Date.now().toString();
}
