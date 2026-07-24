import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock the internal firebase config to bypass import.meta constraints
jest.mock('../../firebase/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

// Mock the AuthContext
jest.mock('../../contexts/AuthContext');

// Mock framer-motion to avoid animation timing issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import Header from '../Header';
import { useAuth } from '../../contexts/AuthContext';

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Accessibility and Interactive Dropdowns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Logged Out State', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: null,
        profile: null,
      });
    });

    it('should render correct ARIA attributes on Guide dropdown toggle', () => {
      renderHeader();

      const guideButton = screen.getByRole('button', { name: /guide/i });
      expect(guideButton).toBeInTheDocument();
      expect(guideButton).toHaveAttribute('aria-haspopup', 'true');
      expect(guideButton).toHaveAttribute('aria-expanded', 'false');
      expect(guideButton).toHaveAttribute('aria-controls', 'guide-dropdown-menu');
    });

    it('should toggle Guide dropdown menu on click', () => {
      renderHeader();

      const guideButton = screen.getByRole('button', { name: /guide/i });
      expect(screen.queryByText('New Scout')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(guideButton);
      expect(guideButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('New Scout')).toBeInTheDocument();

      // Click to close
      fireEvent.click(guideButton);
      expect(guideButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('New Scout')).not.toBeInTheDocument();
    });

    it('should render correct ARIA attributes on Resources dropdown toggle', () => {
      renderHeader();

      const resourcesButton = screen.getByRole('button', { name: /resources/i });
      expect(resourcesButton).toBeInTheDocument();
      expect(resourcesButton).toHaveAttribute('aria-haspopup', 'true');
      expect(resourcesButton).toHaveAttribute('aria-expanded', 'false');
      expect(resourcesButton).toHaveAttribute('aria-controls', 'resources-dropdown-menu');
    });

    it('should toggle Resources dropdown menu on click', () => {
      renderHeader();

      const resourcesButton = screen.getByRole('button', { name: /resources/i });
      expect(screen.queryByText('Troop Calendar')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(resourcesButton);
      expect(resourcesButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Troop Calendar')).toBeInTheDocument();

      // Click to close
      fireEvent.click(resourcesButton);
      expect(resourcesButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Troop Calendar')).not.toBeInTheDocument();
    });

    it('should render correct dynamic aria-label and aria-expanded attributes on mobile menu toggle button', () => {
      renderHeader();

      const mobileToggle = screen.getByLabelText('Open menu');
      expect(mobileToggle).toBeInTheDocument();
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');

      // Click to open mobile menu
      fireEvent.click(mobileToggle);
      expect(mobileToggle).toHaveAttribute('aria-label', 'Close menu');
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');

      // Click to close mobile menu
      fireEvent.click(mobileToggle);
      expect(mobileToggle).toHaveAttribute('aria-label', 'Open menu');
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Logged In State', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: { uid: 'scout-123' },
        profile: { name: 'John Scout', role: 'scout' },
      });
    });

    it('should render correct ARIA attributes on User Menu dropdown toggle', () => {
      renderHeader();

      const userButton = screen.getByRole('button', { name: /john scout/i });
      expect(userButton).toBeInTheDocument();
      expect(userButton).toHaveAttribute('aria-haspopup', 'true');
      expect(userButton).toHaveAttribute('aria-expanded', 'false');
      expect(userButton).toHaveAttribute('aria-controls', 'user-dropdown-menu');
    });

    it('should toggle User Menu on click', () => {
      renderHeader();

      const userButton = screen.getByRole('button', { name: /john scout/i });
      expect(screen.queryByText('My Profile')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(userButton);
      expect(userButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('My Profile')).toBeInTheDocument();

      // Click to close
      fireEvent.click(userButton);
      expect(userButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
    });
  });
});
