
export const auth = {
  currentUser: null,
  signOut: jest.fn(() => Promise.resolve()),
};

export const db = {};
export const firebaseError = null;

export default {
  auth,
  db,
  firebaseError,
};
