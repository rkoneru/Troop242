/**
 * Jest configuration for BSA Troop 242
 * Unit and integration testing for React components and utilities
 */

export default {
  // Test environment: jsdom for React/DOM testing
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module name mapping for CSS and static assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^../firebase/firebase$': '<rootDir>/src/__mocks__/firebase.js',
    '^../../firebase/firebase$': '<rootDir>/src/__mocks__/firebase.js',
  },

  // Transform JSX/ES6 with Babel
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.(test|spec).{js,jsx}',
    '**/?(*.)+(spec|test).{js,jsx}',
  ],

  // Coverage thresholds
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.css',
    '!src/__mocks__/**',
  ],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Test timeout
  testTimeout: 10000,

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
