import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

// Mock framer-motion to simplify DOM structure and animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    button: ({
      whileHover: _whileHover,
      whileTap: _whileTap,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      ...props
    }) => <button {...props} />,
    div: ({
      whileHover: _whileHover,
      whileTap: _whileTap,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      ...props
    }) => <div {...props} />,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('SearchWidget Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders floating search FAB button with shortcut hint', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    const fab = screen.getByRole('button', { name: /open search/i });
    expect(fab).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  test('opens search dialog when FAB is clicked', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    const fab = screen.getByRole('button', { name: /open search/i });
    fireEvent.click(fab);

    const dialog = screen.getByRole('dialog', { name: /search site/i });
    expect(dialog).toBeInTheDocument();

    const input = screen.getByRole('searchbox', { name: /search query/i });
    expect(input).toBeInTheDocument();
  });

  test('shows clear search button when typing and clears query when clicked', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open search overlay
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    const input = screen.getByRole('searchbox', { name: /search query/i });
    fireEvent.change(input, { target: { value: 'Eagle' } });

    // Clear button should appear
    const clearBtn = screen.getByRole('button', { name: /clear search text/i });
    expect(clearBtn).toBeInTheDocument();

    // Click clear button
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
  });

  test('populates search query when clicking a suggestion button', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open search overlay
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    const suggestionBtn = screen.getByRole('button', { name: 'Eagle Scout' });
    fireEvent.click(suggestionBtn);

    const input = screen.getByRole('searchbox', { name: /search query/i });
    expect(input.value).toBe('Eagle Scout');
  });

  test('closes search dialog when close button is clicked', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open search overlay
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    // Click close button
    const closeBtn = screen.getByRole('button', { name: /close search/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: /search site/i })).not.toBeInTheDocument();
  });
});
