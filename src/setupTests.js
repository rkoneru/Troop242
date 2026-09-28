/**
 * Test setup and configuration
 * Runs before each test suite
 */

// Jest DOM matchers (e.g., toBeInTheDocument)
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import webcrypto from 'crypto';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (!global.crypto) {
  global.crypto = webcrypto.webcrypto || webcrypto;
}

if (!window.crypto) {
  window.crypto = global.crypto;
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock framer-motion using cached Map
jest.mock('framer-motion', () => {
  const React = require('react');
  const componentCache = new Map();
  return {
    motion: new Proxy(
      {},
      {
        get: (_, prop) => {
          if (!componentCache.has(prop)) {
            const Component = React.forwardRef(({ children, ...props }, ref) => {
              const filteredProps = { ...props };
              const motionProps = [
                'initial', 'animate', 'exit', 'transition', 'variants',
                'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
                'viewport', 'layout', 'layoutId', 'onAnimationStart', 'onAnimationComplete'
              ];
              motionProps.forEach((p) => delete filteredProps[p]);
              return React.createElement(prop, { ...filteredProps, ref }, children);
            });
            Component.displayName = `motion.${prop}`;
            componentCache.set(prop, Component);
          }
          return componentCache.get(prop);
        },
      }
    ),
    AnimatePresence: ({ children }) => children,
  };
});

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
