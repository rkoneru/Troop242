
export const db = {};
export const auth = {
  currentUser: { uid: 'test-uid', email: 'test@example.com' }
};

export const initializeApp = jest.fn();
export const getAuth = jest.fn(() => auth);
export const getFirestore = jest.fn(() => db);
