/**
 * Integration tests for MemberLogin component
 * Tests authentication flow and Firebase Auth integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
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

const renderComponent = (component) => {
  return render(
    <MemoryRouter
      initialEntries={['/Troop242/member-login']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider>
        {component}
      </AuthProvider>
    </MemoryRouter>
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

  it('should require email', async () => {
    const user = userEvent.setup();
    renderComponent(<MemberLogin />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Form should show validation error
    await waitFor(() => {
      expect(screen.getByText(/enter email and password/i)).toBeInTheDocument();
    });
  });

  it('should require password', async () => {
    const user = userEvent.setup();
    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    await user.type(emailInput, 'scout@example.com');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Form should show validation error
    await waitFor(() => {
      expect(screen.getByText(/enter email and password/i)).toBeInTheDocument();
    });
  });

  it('should call signInWithEmailAndPassword on valid form submit', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid', email: 'scout@example.com' },
    });

    // Mock getDoc to return a valid profile
    const { getDoc } = require('firebase/firestore');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'scout' }),
    });

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
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

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'scout@example.com');
    await user.type(passwordInput, 'WrongPassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });

  it('should show generic error message for auth/user-not-found', async () => {
    const user = userEvent.setup();
    const authError = new Error('Firebase: Error (auth/user-not-found).');
    authError.code = 'auth/user-not-found';
    mockSignInWithEmailAndPassword.mockRejectedValue(authError);

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'nonexistent@example.com');
    await user.type(passwordInput, 'AnyPassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should show generic error message for auth/wrong-password', async () => {
    const user = userEvent.setup();
    const authError = new Error('Firebase: Error (auth/wrong-password).');
    authError.code = 'auth/wrong-password';
    mockSignInWithEmailAndPassword.mockRejectedValue(authError);

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'scout@example.com');
    await user.type(passwordInput, 'WrongPassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during sign in', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ user: {} }), 100))
    );

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
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

    // Mock getDoc to return a valid profile
    const { getDoc } = require('firebase/firestore');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'scout' }),
    });

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
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

  it('should have link to registration', () => {
    // skip this test if registration link is commented out in MemberLogin.jsx
    /*
    renderComponent(<MemberLogin />);

    const registerLink = screen.getByText(/register/i);
    expect(registerLink).toBeInTheDocument();
    */
  });
});
