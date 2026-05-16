
import { render, screen, fireEvent } from '@testing-library/react';
import Badges from '../Badges';
import { MemoryRouter } from 'react-router-dom';

// Mock scrollToTop
jest.mock('../../utils/scrollToTop', () => ({
  scrollToTop: jest.fn(),
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const renderBadges = () => {
  return render(
    <MemoryRouter>
      <Badges />
    </MemoryRouter>
  );
};

describe('Badges Component Optimization Logic', () => {
  test('renders all categories initially', () => {
    renderBadges();
    expect(screen.getByText('Eagle Required')).toBeInTheDocument();
    expect(screen.getByText('Outdoor Adventures')).toBeInTheDocument();
  });

  test('filters categories based on search term', () => {
    renderBadges();
    const searchInput = screen.getByPlaceholderText('Search categories...');

    fireEvent.change(searchInput, { target: { value: 'Camping' } });

    // "Camping" badge is in "Eagle Required" and "Outdoor Adventures" (as Camping merit badge)
    // Wait, let's check specifically.
    expect(screen.getByText('Eagle Required')).toBeInTheDocument();
    // Some categories might be filtered out
    expect(screen.queryByText('Arts & Crafts')).not.toBeInTheDocument();
  });

  test('filters badges within categories', async () => {
    renderBadges();
    const searchInput = screen.getByPlaceholderText('Search categories...');

    fireEvent.change(searchInput, { target: { value: 'First Aid' } });

    // Eagle Required should be visible because it contains First Aid
    const category = screen.getByText('Eagle Required');
    expect(category).toBeInTheDocument();

    // Click to expand
    fireEvent.click(category);

    expect(screen.getByText('✓ First Aid')).toBeInTheDocument();
    // Some other mandatory badge should be filtered out
    expect(screen.queryByText('✓ Cooking')).not.toBeInTheDocument();
  });

  test('shows no results message when no match is found', () => {
    renderBadges();
    const searchInput = screen.getByPlaceholderText('Search categories...');

    fireEvent.change(searchInput, { target: { value: 'NonExistentBadge' } });

    expect(screen.getByText(/No badges found matching/)).toBeInTheDocument();
  });
});
