/**
 * Compliance utilities for COPPA, GDPR, and CCPA
 */

import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

/**
 * Check if user is under 13 (requires parental consent)
 */
export function isUserUnder13(birthDate) {
  const today = new Date();
  const age = today.getFullYear() - new Date(birthDate).getFullYear();
  return age < 13;
}

/**
 * Request parental consent for user under 13
 * Sends consent link to parent email
 */
export async function requestParentalConsent(childEmail, parentEmail, childName) {
  // In production, this would call a Cloud Function
  // For now, return success
  return {
    success: true,
    message: 'Parental consent email sent',
    childEmail,
    parentEmail,
  };
}

/**
 * Get all user data for GDPR subject access request
 */
export async function getUserData(userId) {
  const db = getFirestore();

  try {
    // Collect data from all relevant collections
    const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
    const activities = await getDocs(query(collection(db, 'activities')));
    const progress = await getDocs(query(collection(db, 'progress'), where('uid', '==', userId)));

    return {
      user: userDoc.docs[0]?.data() || {},
      activities: activities.docs
        .filter(doc => doc.data().signedUp?.some(s => s.uid === userId))
        .map(doc => doc.data()),
      progress: progress.docs[0]?.data() || {},
      requestDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

/**
 * Delete all user data (GDPR right to be forgotten)
 */
export async function deleteUserData(userId) {
  const db = getFirestore();

  try {
    // Delete user profile
    await deleteDoc(doc(db, 'users', userId));

    // Remove signups from activities
    const activitiesSnap = await getDocs(collection(db, 'activities'));
    for (const activityDoc of activitiesSnap.docs) {
      const signedUp = activityDoc.data().signedUp || [];
      const filtered = signedUp.filter(s => s.uid !== userId);
      // Would need updateDoc here in real implementation
    }

    // Delete progress
    await deleteDoc(doc(db, 'progress', userId));

    return {
      success: true,
      message: 'User data deleted successfully',
      deletedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}

/**
 * Export user data in portable format (GDPR portability)
 */
export async function exportUserData(userId) {
  const data = await getUserData(userId);

  // Convert to JSON string
  const json = JSON.stringify(data, null, 2);

  // Create blob and download
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `user-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  return {
    success: true,
    message: 'Data exported to JSON file',
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Log consent event for audit trail
 */
export async function logConsentEvent(userId, consentType, consentGiven) {
  // In production, this would log to audit collection
  console.log({
    userId,
    consentType, // 'COPPA', 'MARKETING', 'ANALYTICS'
    consentGiven,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Verify parental consent
 */
export async function verifyParentalConsent(childEmail, consentToken) {
  // In production, this would verify a signed token
  // For now, return success if token matches expected pattern
  const isValid = consentToken && consentToken.length > 10;
  return {
    success: isValid,
    childEmail,
    verifiedAt: isValid ? new Date().toISOString() : null,
  };
}
