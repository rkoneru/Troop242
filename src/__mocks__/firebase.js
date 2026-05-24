const mockFn = () => jest.fn();

export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((auth, cb) => {
    cb && cb(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
};

export const db = {
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
};

export const doc = jest.fn();
export const collection = jest.fn();
export const getDoc = jest.fn();
export const getDocs = jest.fn();
export const setDoc = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
export const addDoc = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const Timestamp = {
  now: jest.fn(() => ({ toDate: () => new Date() })),
  fromDate: jest.fn(date => ({ toDate: () => date })),
};

export const firebaseError = null;

export default {
  auth: () => auth,
  firestore: () => db,
};
