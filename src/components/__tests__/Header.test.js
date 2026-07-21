import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';
import { useAuth } from '../../contexts/AuthContext';

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const renderHeader = () => {
  return render(
    <MemoryRouter initialEntries={['/Troop242/']}>
      <Header />
    </MemoryRouter>
  );
};

describe('Header Accessibility and Interactive UX', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dropdown toggles with accessibility attributes in logged out state', async () => {
    useAuth.mockReturnValue({
      user: null,
      profile: null,
    });

    renderHeader();

    const guideButton = screen.getByRole('button', { name: /Guide/ });
    const resourcesButton = screen.getByRole('button', { name: /Resources/ });
    const mobileMenuButton = screen.getByRole('button', { name: /Open menu/ });

    expect(guideButton).toHaveAttribute('aria-haspopup', 'true');
    expect(guideButton).toHaveAttribute('aria-expanded', 'false');
    expect(guideButton).toHaveAttribute('aria-controls', 'guide-dropdown-menu');

    expect(resourcesButton).toHaveAttribute('aria-haspopup', 'true');
    expect(resourcesButton).toHaveAttribute('aria-expanded', 'false');
    expect(resourcesButton).toHaveAttribute('aria-controls', 'resources-dropdown-menu');

    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles Guide and Resources dropdown on click and handles Escape key', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({
      user: null,
      profile: null,
    });

    renderHeader();

    const guideButton = screen.getByRole('button', { name: /Guide/ });
    expect(guideButton).toHaveAttribute('aria-expanded', 'false');

    // Click to expand (using fireEvent to simulate keyboard click without hover events)
    fireEvent.click(guideButton);
    expect(guideButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('New Scout')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(guideButton);
    expect(guideButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open and press Escape to close
    fireEvent.click(guideButton);
    expect(guideButton).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(guideButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders user profile dropdown in logged-in state', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({
      user: { uid: 'test-scout' },
      profile: { name: 'Alex Scout', role: 'scout' },
    });

    renderHeader();

    const userProfileButton = screen.getByRole('button', { name: /Alex Scout/ });
    expect(userProfileButton).toHaveAttribute('aria-haspopup', 'true');
    expect(userProfileButton).toHaveAttribute('aria-expanded', 'false');
    expect(userProfileButton).toHaveAttribute('aria-controls', 'user-dropdown-menu');

    // Click to open user menu
    await user.click(userProfileButton);
    expect(userProfileButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
