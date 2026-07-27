/**
 * Test setup and configuration
 * Runs before each test suite
 */

// Jest DOM matchers (e.g., toBeInTheDocument)
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    this.callback([{ isIntersecting: true, target: element }]);
  }
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  const dummy = React.forwardRef(({ children, ...props }, ref) => {
    const cleanProps = {};
    Object.keys(props).forEach((key) => {
      if (
        ![
          'initial',
          'animate',
          'exit',
          'variants',
          'transition',
          'whileHover',
          'whileTap',
          'whileInView',
          'viewport',
        ].includes(key)
      ) {
        cleanProps[key] = props[key];
      }
    });
    return React.createElement('div', { ...cleanProps, ref }, children);
  });
  return {
    motion: new Proxy(
      {},
      {
        get: () => dummy,
      }
    ),
    AnimatePresence: ({ children }) => children,
  };
});

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('./firebase/firebase', () => ({
  get auth() {
    const { getAuth } = require('firebase/auth');
    return getAuth();
  },
  get db() {
    const { getFirestore } = require('firebase/firestore');
    return getFirestore();
  },
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ data: () => ({ role: 'scout' }) })),
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
