/**
 * Test setup and configuration
 * Runs before each test suite
 */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';
import webcrypto from 'node:crypto';

// Polyfill TextEncoder/TextDecoder for React Router 7 / JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill web crypto
if (!global.crypto) {
  global.crypto = webcrypto.webcrypto || webcrypto;
}

// Set initial pathname for basename matching
if (typeof window !== 'undefined') {
  window.history.pushState({}, '', '/Troop242/');
  window.scrollTo = jest.fn();
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Firebase App and Auth/Firestore
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    if (typeof callback === 'function') {
      callback(null);
    }
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
  Timestamp: {
    now: jest.fn(() => new Date()),
    fromDate: jest.fn(date => date),
  },
}));

// Mock local firebase config module to avoid import.meta syntax error in Jest
jest.mock('./firebase/firebase', () => ({
  get auth() {
    return require('firebase/auth').getAuth();
  },
  get db() {
    return require('firebase/firestore').getFirestore();
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
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('React Router') ||
       args[0].includes('not wrapped in act'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
