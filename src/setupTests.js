/**
 * Test setup and configuration
 * Runs before each test suite
 */

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  const componentMap = new Map();
  const motion = new Proxy(
    {},
    {
      get: (_, prop) => {
        if (!componentMap.has(prop)) {
          const MotionComponent = React.forwardRef(
            ({ children, initial: _initial, animate: _animate, exit: _exit, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }, ref) =>
              React.createElement(prop, { ...props, ref }, children)
          );
          MotionComponent.displayName = `motion.${prop}`;
          componentMap.set(prop, MotionComponent);
        }
        return componentMap.get(prop);
      },
    }
  );
  return {
    motion,
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

// Set initial URL pathname to include basename for React Router 7 in JSDOM
if (typeof window !== 'undefined') {
  window.history.pushState({}, '', '/Troop242/');
  window.scrollTo = jest.fn();
}

// Mock IntersectionObserver for Framer Motion
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

// Jest DOM matchers (e.g., toBeInTheDocument)
import '@testing-library/jest-dom';

// Mock local firebase module to prevent import.meta issues
jest.mock('./firebase/firebase', () => ({
  auth: {},
  db: {},
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
  doc: jest.fn(),
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
