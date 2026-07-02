/**
 * Integration tests for MemberLogin component
 * Tests authentication flow and Firebase Auth integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MemberLogin from '../MemberLogin';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock Firebase Auth
const mockSignInWithEmailAndPassword = jest.fn();
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

// Mock Firebase Firestore
const mockGetDoc = jest.fn();
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: (...args) => mockGetDoc(...args),
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

const renderComponent = (component) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('MemberLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    renderComponent(<MemberLogin />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should require email and password', async () => {
    const user = userEvent.setup();
    renderComponent(<MemberLogin />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Form should show validation error
    await waitFor(() => {
      expect(screen.getByText(/Please enter email and password/i)).toBeInTheDocument();
    });
  });

  it('should call signInWithEmailAndPassword on valid form submit', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid', email: 'scout@example.com' },
    });
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'scout' }),
    });

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'scout@example.com');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'scout@example.com',
        'Password123'
      );
    });
  });

  it('should handle authentication errors', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockRejectedValue(
      new Error('Invalid credentials')
    );

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'scout@example.com');
    await user.type(passwordInput, 'WrongPassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during sign in', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ user: {} }), 100))
    );

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'scout@example.com');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    // Button should be disabled or show loading state
    await waitFor(() => {
      expect(submitButton).toHaveAttribute('disabled');
    });
  });

  it('should trim email input', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid' },
    });
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'scout' }),
    });

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, '  scout@example.com  ');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'scout@example.com',
        'Password123'
      );
    });
  });

  it('should have Support section', () => {
    renderComponent(<MemberLogin />);

    const supportHeader = screen.getByText(/💬 Support/i);
    expect(supportHeader).toBeInTheDocument();
  });
});
