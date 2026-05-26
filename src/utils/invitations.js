/**
 * Invitation management utilities
 * Generates secure, expiring invitation codes for user registration
 */

import { doc, setDoc, getDoc, getDocs, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Generate a cryptographically secure random invitation code (browser-compatible)
 * @returns {string} 12-character random code (uppercase hex)
 */
export function generateSecureInviteCode() {
  // Use Web Crypto API for browser compatibility
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  // Convert to base36 for more compact, readable alphanumeric codes
  // We use 6 bytes which gives roughly 8-10 alphanumeric characters
  const hex = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return parseInt(hex, 16).toString(36).toUpperCase().padStart(8, '0');
}

/**
 * Generate a secure, highly readable random password
 * @param {number} length - Password length (default 10)
 * @returns {string} Random alphanumeric password
 */
export function generateSecurePassword(length = 10) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'; // No similar characters like I, l, 1, 0, O
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}

/**
 * Create a new invitation in Firestore
 * @param {string} role - 'scout' or 'leader'
 * @param {number} expiresInDays - Days until expiration (default 30)
 * @param {string} createdByUid - UID of admin/leader creating invitation (optional)
 * @param {object} metadata - Additional metadata to store (optional)
 * @returns {Promise<string>} The generated invitation code
 */
export async function createInvitation(role, expiresInDays = 30, createdByUid = null, metadata = {}) {
  if (!['scout', 'leader'].includes(role)) {
    throw new Error('Role must be "scout" or "leader"');
  }

  const code = generateSecureInviteCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);

  const invitationData = {
    code,
    role,
    status: 'pending', // pending, used, expired, revoked
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(expiresAt),
    usedBy: null,
    usedAt: null,
    usedEmail: null,
    createdByUid: createdByUid || null,
    ...metadata
  };

  try {
    await setDoc(doc(db, 'invitations', code), invitationData);
    return code;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw new Error('Failed to create invitation code');
  }
}

/**
 * Verify and get invitation details
 * @param {string} code - The invitation code to verify
 * @returns {Promise<Object|null>} Invitation data if valid and pending, null otherwise
 */
export async function verifyInvitation(code) {
  if (!code) return null;

  try {
    const inviteSnap = await getDoc(doc(db, 'invitations', code));

    if (!inviteSnap.exists()) {
      return null;
    }

    const invitation = inviteSnap.data();

    // Check if expired
    if (invitation.expiresAt.toDate() < new Date()) {
      return null;
    }

    // Check if already used or revoked
    if (invitation.status !== 'pending') {
      return null;
    }

    return invitation;
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return null;
  }
}

/**
 * Mark invitation as used
 * @param {string} code - The invitation code
 * @param {string} uid - The UID of the user who used it
 * @param {string} email - The email of the user who used it
 * @returns {Promise<void>}
 */
export async function markInvitationUsed(code, uid, email) {
  try {
    await setDoc(
      doc(db, 'invitations', code),
      {
        status: 'used',
        usedBy: uid,
        usedAt: Timestamp.now(),
        usedEmail: email
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error marking invitation as used:', error);
    throw new Error('Failed to update invitation status');
  }
}

/**
 * Revoke an invitation (prevent further use)
 * @param {string} code - The invitation code
 * @returns {Promise<void>}
 */
export async function revokeInvitation(code) {
  try {
    await setDoc(
      doc(db, 'invitations', code),
      { status: 'revoked' },
      { merge: true }
    );
  } catch (error) {
    console.error('Error revoking invitation:', error);
    throw new Error('Failed to revoke invitation');
  }
}

/**
 * Get all invitations (admin only)
 * @returns {Promise<Array>} Array of invitation objects with their codes
 */
export async function getAllInvitations() {
  try {
    // This should be called with proper Firestore rules to limit to admins
    const snap = await getDocs(collection(db, 'invitations'));
    return snap.docs.map(doc => ({
      code: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }
}
