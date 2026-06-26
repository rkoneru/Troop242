/**
 * Integration tests for MemberLogin component
 * Tests authentication flow and Firebase Auth integration
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MemberLogin from '../MemberLogin';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the entire firebase module to avoid import.meta errors
jest.mock('../../firebase/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  firebaseError: null,
}));

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
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
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
      expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
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
      expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
    });
  });

  it('should call signInWithEmailAndPassword on valid form submit', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid', email: 'scout@example.com' },
    });

    // Mock Firestore calls
    const { doc, getDoc } = require('firebase/firestore');
    doc.mockReturnValue('mock-doc-ref');
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
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'scout@example.com',
        'Password123'
      );
    });
  });

  it('should handle authentication errors', async () => {
    const user = userEvent.setup();
    mockSignInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/invalid-credential',
      message: 'Invalid credentials'
    });

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

    // Mock Firestore calls
    const { doc, getDoc } = require('firebase/firestore');
    doc.mockReturnValue('mock-doc-ref');
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
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'scout@example.com',
        'Password123'
      );
    });
  });

  // Commented out as registration link is currently hidden in the component
  // it('should have link to registration', () => {
  //   renderComponent(<MemberLogin />);
  //
  //   const registerLink = screen.getByText(/register/i);
  //   expect(registerLink).toBeInTheDocument();
  // });
});
