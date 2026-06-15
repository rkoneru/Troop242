
export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
};

export const db = {
  collection: jest.fn(),
  doc: jest.fn(),
};

export const firebaseError = null;

export default {
  auth,
  db,
  firebaseError,
};
