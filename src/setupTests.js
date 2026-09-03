/* eslint-disable no-unused-vars */
/**
 * Test setup and configuration
 * Runs before each test suite
 */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof window !== 'undefined') {
  window.scrollTo = jest.fn();
}

// Polyfill window.crypto for tests
if (typeof window !== 'undefined' && !window.crypto) {
  window.crypto = {
    getRandomValues: (buffer) => {
      const crypto = require('crypto');
      return crypto.randomFillSync(buffer);
    },
  };
}

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

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

// Mock local firebase config
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

// Mock framer-motion for tests with stable component references
jest.mock('framer-motion', () => {
  const React = require('react');
  const actual = jest.requireActual('framer-motion');
  const componentCache = new Map();
  const customMotion = new Proxy(
    {},
    {
      get: (target, prop) => {
        if (!componentCache.has(prop)) {
          componentCache.set(
            prop,
            React.forwardRef(({ children, ...props }, ref) => {
              const {
                initial,
                animate,
                exit,
                variants,
                transition,
                whileHover,
                whileTap,
                whileFocus,
                whileInView,
                viewport,
                ...validProps
              } = props;
              return React.createElement(prop, { ...validProps, ref }, children);
            })
          );
        }
        return componentCache.get(prop);
      },
    }
  );
  return {
    ...actual,
    motion: customMotion,
    AnimatePresence: ({ children }) => children,
  };
});
