/**
 * Integration tests for SendInvitations component
 * Tests creation of secure invitations using cryptographically secure PRNG
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SendInvitations from '../SendInvitations';
import { generateSecureInviteCode } from '../../utils/invitations';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: 'leader-123' });
    return jest.fn();
  }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn().mockResolvedValue({ id: 'inv-123' }),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'leader-123' },
    profile: { role: 'admin', name: 'Leader Admin' },
    loading: false,
  }),
}));

jest.mock('../../utils/invitations', () => ({
  generateSecureInviteCode: jest.fn(() => 'SECURE123456'),
}));

const renderComponent = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SendInvitations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render invitation form', () => {
    renderComponent(<SendInvitations />);
    expect(screen.getByPlaceholderText(/person@example.com/i)).toBeInTheDocument();
  });

  it('should generate invitation code using secure PRNG when creating invitation', async () => {
    const user = userEvent.setup();
    renderComponent(<SendInvitations />);

    const emailInput = screen.getByPlaceholderText(/person@example.com/i);
    const submitBtn = screen.getByRole('button', { name: /create invitation/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(generateSecureInviteCode).toHaveBeenCalled();
    });
  });
});
