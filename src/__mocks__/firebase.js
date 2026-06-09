export const auth = {
  currentUser: null,
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
