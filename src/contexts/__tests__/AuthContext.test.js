/**
 * Unit tests for AuthContext
 * Tests authentication state management and user profile loading
 */

import React, { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../AuthContext';

// Mock Firebase Auth
const mockOnAuthStateChanged = jest.fn();
const mockSignOut = jest.fn();

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
  signOut: (...args) => mockSignOut(...args),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, profile, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <div>Email: {user.email}</div>
      <div>Name: {profile?.name || 'No name'}</div>
      <div>Role: {profile?.role || 'No role'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide default values while loading', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate delayed callback
      setTimeout(() => callback(null), 100);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show not authenticated when user is null', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });
  });

  it('should show user email when authenticated', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'scout@example.com',
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Email: scout@example.com/)).toBeInTheDocument();
    });
  });

  it('should load user profile from Firestore', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'scout@example.com',
    };

    const { getDoc } = require('firebase/firestore');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: 'John Scout',
        role: 'scout',
      }),
    });

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Name: John Scout/)).toBeInTheDocument();
      expect(screen.getByText(/Role: scout/)).toBeInTheDocument();
    });
  });

  it('should handle missing user profile', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'scout@example.com',
    };

    const { getDoc } = require('firebase/firestore');
    getDoc.mockResolvedValue({
      exists: () => false,
    });

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Name: No name/)).toBeInTheDocument();
      expect(screen.getByText(/Role: No role/)).toBeInTheDocument();
    });
  });

  it('should unsubscribe from auth listener on unmount', () => {
    const unsubscribeMock = jest.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribeMock);

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('should update profile when user changes', async () => {
    const mockUser1 = {
      uid: 'user-1',
      email: 'scout1@example.com',
    };

    const mockUser2 = {
      uid: 'user-2',
      email: 'scout2@example.com',
    };

    const { getDoc } = require('firebase/firestore');
    getDoc
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ name: 'Scout One', role: 'scout' }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ name: 'Scout Two', role: 'leader' }),
      });

    let authCallback;
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      authCallback = callback;
      callback(mockUser1);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Name: Scout One/)).toBeInTheDocument();
    });

    // Simulate user change
    authCallback(mockUser2);

    await waitFor(() => {
      expect(screen.getByText(/Name: Scout Two/)).toBeInTheDocument();
      expect(screen.getByText(/Role: leader/)).toBeInTheDocument();
    });
  });

  it('should handle Firestore errors gracefully', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'scout@example.com',
    };

    const { getDoc } = require('firebase/firestore');
    getDoc.mockRejectedValue(new Error('Firestore error'));

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    // Should not crash
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Email: scout@example.com/)).toBeInTheDocument();
    });
  });
});
