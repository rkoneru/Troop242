/**
 * Test setup and configuration
 * Runs before each test suite
 */

import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (!global.crypto) {
  const { webcrypto } = require('crypto');
  global.crypto = webcrypto;
}
if (!window.crypto) {
  window.crypto = global.crypto;
}

window.scrollTo = jest.fn();

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverMock;

// Mock framer-motion using Map cache for stable component references
jest.mock('framer-motion', () => {
  const React = require('react');
  const componentMap = new Map();

  const createComponent = (tag) => {
    if (componentMap.has(tag)) {
      return componentMap.get(tag);
    }
    const Component = React.forwardRef(({ children, ...props }, ref) => {
      // Filter out framer-motion specific props
      const validProps = { ...props, ref };
      delete validProps.initial;
      delete validProps.animate;
      delete validProps.exit;
      delete validProps.transition;
      delete validProps.variants;
      delete validProps.whileHover;
      delete validProps.whileTap;
      delete validProps.whileInView;
      delete validProps.viewport;
      delete validProps.layout;
      delete validProps.layoutId;

      return React.createElement(tag, validProps, children);
    });
    Component.displayName = `motion.${tag}`;
    componentMap.set(tag, Component);
    return Component;
  };

  const motion = new Proxy(
    {},
    {
      get: (_, prop) => createComponent(prop),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

// Jest DOM matchers (e.g., toBeInTheDocument)
import '@testing-library/jest-dom';

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
