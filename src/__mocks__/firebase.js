export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((callback) => {
    callback(null);
    return jest.fn();
  }),
};

export const db = {};

export const firebaseError = null;

const app = {};
export default app;
