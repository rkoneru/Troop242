import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchWidget from '../SearchWidget';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock framer-motion to bypass animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }) => <button {...props}>{children}</button>,
    div: ({ children, initial, animate, exit, transition, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the SearchIndex utility search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query === 'camp') {
      return [
        {
          title: 'Spring Campout',
          excerpt: 'Join us for a fun spring camping event!',
          category: 'Events',
          url: '/calendar',
          icon: '🏕️',
        },
      ];
    }
    return [];
  }),
}));

describe('SearchWidget Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the floating search button with correct accessible label', () => {
    render(<SearchWidget />);
    const searchButton = screen.getByRole('button', { name: /open search/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveAttribute('aria-label', 'Open search (Alt+S or Ctrl+K)');
  });

  test('opens search modal on Alt+S keydown event', () => {
    render(<SearchWidget />);

    // Search input should not be in the document initially
    expect(screen.queryByPlaceholderText(/search ranks, badges/i)).not.toBeInTheDocument();

    // Trigger Alt+S keydown event on window
    fireEvent.keyDown(window, { key: 's', altKey: true });

    // Search input should now be visible in the document
    expect(screen.getByPlaceholderText(/search ranks, badges/i)).toBeInTheDocument();
  });

  test('opens search modal on Ctrl+K keydown event', () => {
    render(<SearchWidget />);

    // Trigger Ctrl+K keydown event on window
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    // Search input should be visible in the document
    expect(screen.getByPlaceholderText(/search ranks, badges/i)).toBeInTheDocument();
  });

  test('performs a search query and navigates when result clicked', () => {
    render(<SearchWidget />);

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    const input = screen.getByPlaceholderText(/search ranks, badges/i);

    // Type query
    fireEvent.change(input, { target: { value: 'camp' } });

    // Result should be visible
    expect(screen.getByText('Spring Campout')).toBeInTheDocument();
    expect(screen.getByText(/Join us for a fun spring camping/i)).toBeInTheDocument();

    // Click result and verify navigation
    fireEvent.click(screen.getByText('Spring Campout'));
    expect(mockNavigate).toHaveBeenCalledWith('/calendar');
  });

  test('closes search modal when pressing Escape', () => {
    render(<SearchWidget />);

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));
    expect(screen.getByPlaceholderText(/search ranks, badges/i)).toBeInTheDocument();

    // Press escape
    fireEvent.keyDown(window, { key: 'Escape' });

    // Modal should close
    expect(screen.queryByPlaceholderText(/search ranks, badges/i)).not.toBeInTheDocument();
  });
});
