/**
 * Integration tests for RegisterWithInvite component
 * Tests registration with invitation code validation and Firebase Auth
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterWithInvite from '../RegisterWithInvite';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock Firebase functions
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockVerifyInvitation = jest.fn();
const mockMarkInvitationUsed = jest.fn();

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUserWithEmailAndPassword(...args),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

jest.mock('../../utils/invitations', () => ({
  verifyInvitation: (...args) => mockVerifyInvitation(...args),
  markInvitationUsed: (...args) => mockMarkInvitationUsed(...args),
}));

const renderComponent = (component) => {
  return render(
    <BrowserRouter basename="/Troop242/">
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('RegisterWithInvite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render registration form', () => {
    renderComponent(<RegisterWithInvite />);

    expect(screen.getByPlaceholderText(/invitation code/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
  });

  it('should require invitation code', async () => {
    const user = userEvent.setup();
    renderComponent(<RegisterWithInvite />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/code/i)).toBeInTheDocument();
    });
  });

  it('should validate invitation code before allowing registration', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(false);

    renderComponent(<RegisterWithInvite />);

    const codeInput = screen.getByPlaceholderText(/invitation code/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(codeInput, 'invalid-code');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockVerifyInvitation).toHaveBeenCalledWith('invalid-code');
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });

  it('should accept valid invitation code', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(true);
    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'new-user-uid', email: 'newscout@example.com' },
    });

    renderComponent(<RegisterWithInvite />);

    const codeInput = screen.getByPlaceholderText(/invitation code/i);
    await user.type(codeInput, 'valid-code');

    await waitFor(() => {
      // Should not show error for valid code
      const errorElements = screen.queryAllByText(/invalid/i);
      const codeErrors = errorElements.filter(el =>
        el.textContent.toLowerCase().includes('code')
      );
      expect(codeErrors.length).toBe(0);
    });
  });

  it('should require email', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(true);

    renderComponent(<RegisterWithInvite />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });
  });

  it('should require matching passwords', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(true);

    renderComponent(<RegisterWithInvite />);

    const passwordInput = screen.getByPlaceholderText(/^password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);

    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password456');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/match/i)).toBeInTheDocument();
    });
  });

  it('should create account with valid data', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(true);
    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'new-uid', email: 'newscout@example.com' },
    });
    mockMarkInvitationUsed.mockResolvedValue(undefined);

    renderComponent(<RegisterWithInvite />);

    const codeInput = screen.getByPlaceholderText(/invitation code/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(codeInput, 'valid-code');
    await user.type(emailInput, 'newscout@example.com');
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'newscout@example.com',
        'Password123'
      );
    });
  });

  it('should mark invitation as used after successful registration', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(true);
    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'new-uid', email: 'newscout@example.com' },
    });
    mockMarkInvitationUsed.mockResolvedValue(undefined);

    renderComponent(<RegisterWithInvite />);

    const codeInput = screen.getByPlaceholderText(/invitation code/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(codeInput, 'valid-code');
    await user.type(emailInput, 'newscout@example.com');
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMarkInvitationUsed).toHaveBeenCalled();
    });
  });

  it('should handle registration errors', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(true);
    mockCreateUserWithEmailAndPassword.mockRejectedValue(
      new Error('Email already in use')
    );

    renderComponent(<RegisterWithInvite />);

    const codeInput = screen.getByPlaceholderText(/invitation code/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(codeInput, 'valid-code');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email.*already/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during registration', async () => {
    const user = userEvent.setup();
    mockVerifyInvitation.mockResolvedValue(true);
    mockCreateUserWithEmailAndPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ user: { uid: 'new-uid' } }), 100))
    );

    renderComponent(<RegisterWithInvite />);

    const codeInput = screen.getByPlaceholderText(/invitation code/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(codeInput, 'valid-code');
    await user.type(emailInput, 'newscout@example.com');
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveAttribute('disabled');
    });
  });
});
