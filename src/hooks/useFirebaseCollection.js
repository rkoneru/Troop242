/**
 * Custom hook for Firestore collection queries
 * Handles loading, caching, and error states
 */

import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';

/**
 * Hook for fetching Firestore collection with optional query
 * @param {string} collectionName - Name of Firestore collection
 * @param {Array} queryConstraints - Optional Firestore query constraints
 * @returns {Object} { data, loading, error, refetch }
 */
export function useFirebaseCollection(collectionName, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const db = getFirestore();
      const collRef = collection(db, collectionName);
      const q = queryConstraints.length > 0 ? query(collRef, ...queryConstraints) : collRef;

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(docs);
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  return { data, loading, error, refetch: fetchData };
}
