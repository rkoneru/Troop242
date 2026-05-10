/**
 * Integration tests for MemberLogin component
 * Tests authentication flow and Firebase Auth integration
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MemberLogin from '../MemberLogin';
import { AuthProvider } from '../../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

// Mock firebase configuration
jest.mock('../../firebase/firebase', () => ({
  auth: { currentUser: null },
  db: {}
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn()
}));

const renderComponent = (component) => {
  return render(
    <MemoryRouter initialEntries={['/Troop242/member-login']}>
      <AuthProvider>
        <Routes>
          <Route path="/Troop242/member-login" element={component} />
        </Routes>
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
      expect(screen.getByText(/Please enter email and password/i)).toBeInTheDocument();
    });
  });

  it('should require password', async () => {
    const user = userEvent.setup();
    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'scout@example.com');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Form should show validation error
    await waitFor(() => {
      expect(screen.getByText(/Please enter email and password/i)).toBeInTheDocument();
    });
  });

  it('should call signInWithEmailAndPassword on valid form submit', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid', email: 'scout@example.com' },
    });
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'scout' })
    });

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'scout@example.com');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'scout@example.com',
        'Password123'
      );
    });
  });

  it('should handle authentication errors with generic message (security)', async () => {
    const user = userEvent.setup();
    // Simulate Firebase auth/user-not-found error
    signInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/user-not-found'
    });

    renderComponent(<MemberLogin />);

    // Use queryBy because of potential framer-motion initial state issues in JSDOM
    // though getBy should work if rendered.
    // The previous failure showed it couldn't find it even though it was in the log.

    const emailInput = await screen.findByPlaceholderText(/email/i);
    const passwordInput = await screen.findByPlaceholderText(/password/i);
    const submitButton = await screen.findByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'nonexistent@example.com');
    await user.type(passwordInput, 'any-password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });

    // Also check for auth/wrong-password
    signInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/wrong-password'
    });

    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'wrong-password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during sign in', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockImplementation(
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
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid' },
    });
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'scout' })
    });

    renderComponent(<MemberLogin />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, '  scout@example.com  ');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'scout@example.com',
        'Password123'
      );
    });
  });

});
