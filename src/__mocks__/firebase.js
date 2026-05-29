import { jest } from '@jest/globals';

export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
};

export const db = {
  collection: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ docs: [] })),
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
    })),
  })),
};

export const doc = jest.fn();
export const getDoc = jest.fn();
export const getDocs = jest.fn();
export const collection = jest.fn();
export const query = jest.fn();
export const where = jest.fn();

export const firebaseError = null;

export default { auth, db };
