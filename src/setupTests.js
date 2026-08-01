/**
 * Test setup and configuration
 * Runs before each test suite
 */

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Jest DOM matchers (e.g., toBeInTheDocument)
import '@testing-library/jest-dom';

// Mock Firebase config to prevent import.meta error during Jest runs
jest.mock('./firebase/firebase', () => ({
  auth: {},
  db: {},
  firebaseError: null,
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
  arrayUnion: jest.fn(val => val),
  arrayRemove: jest.fn(val => val),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock framer-motion to bypass animation delays and errors
jest.mock('framer-motion', () => {
  const React = require('react');
  const dummy = ({ children }) => children;
  const motion = new Proxy(
    {},
    {
      get: (target, key) => {
        return React.forwardRef((props, ref) => {
          return React.createElement(key, { ...props, ref });
        });
      },
    }
  );
  return {
    motion,
    AnimatePresence: dummy,
    useAnimation: () => ({
      start: () => Promise.resolve(),
      stop: () => {},
    }),
  };
});

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
