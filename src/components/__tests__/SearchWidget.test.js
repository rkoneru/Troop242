import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

// Mock SearchIndex search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query.toLowerCase().includes('camp')) {
      return [
        { title: 'Camping Guide', excerpt: 'Learn camping skills', category: 'Guide', url: '/camping-guide', icon: '🏕️' },
        { title: 'Spring Campout', excerpt: 'Annual camping trip', category: 'Events', url: '/calendar', icon: '⛺' }
      ];
    }
    return [];
  })
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders floating search button with accessible attributes', () => {
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    const fabButton = screen.getByRole('button', { name: /open search/i });
    expect(fabButton).toBeInTheDocument();
    expect(fabButton).toHaveAttribute('aria-haspopup', 'dialog');
    expect(fabButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens modal, handles search query, and provides clear button', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    const fabButton = screen.getByRole('button', { name: /open search/i });
    await user.click(fabButton);

    const dialog = screen.getByRole('dialog', { name: /search site/i });
    expect(dialog).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /search site/i });
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'camp');

    expect(screen.getByText('Camping Guide')).toBeInTheDocument();
    expect(screen.getByText('Spring Campout')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /clear search query/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(searchInput).toHaveValue('');
    expect(screen.queryByText('Camping Guide')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Enter)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button', { name: /open search/i }));
    const searchInput = screen.getByRole('searchbox', { name: /search site/i });
    await user.type(searchInput, 'camp');

    const resultOptions = screen.getAllByRole('option');
    expect(resultOptions).toHaveLength(2);

    // Arrow down selects first item
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(resultOptions[0]).toHaveAttribute('aria-selected', 'true');
    expect(resultOptions[0]).toHaveClass('search-result-item--active');

    // Arrow down selects second item
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(resultOptions[1]).toHaveAttribute('aria-selected', 'true');

    // Arrow up selects first item again
    fireEvent.keyDown(searchInput, { key: 'ArrowUp' });
    expect(resultOptions[0]).toHaveAttribute('aria-selected', 'true');
  });
});
