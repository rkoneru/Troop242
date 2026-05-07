
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

// Mock search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query === 'eagle') {
      return [
        { title: 'Eagle Scout', excerpt: 'Highest rank', url: '/ranks', category: 'Rank', icon: '🦅' },
        { title: 'Eagle Project', excerpt: 'Service project', url: '/ranks', category: 'Rank', icon: '📋' }
      ];
    }
    return [];
  })
}));

describe('SearchWidget', () => {
  it('should open when Ctrl+K is pressed', async () => {
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    expect(screen.getByPlaceholderText(/Search ranks/i)).toBeInTheDocument();
  });

  it('should open when Alt+S is pressed', async () => {
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    fireEvent.keyDown(window, { key: 's', altKey: true });

    expect(screen.getByPlaceholderText(/Search ranks/i)).toBeInTheDocument();
  });

  it('should navigate results with arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    // Open widget
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const input = screen.getByPlaceholderText(/Search ranks/i);
    await user.type(input, 'eagle');

    const results = screen.getAllByRole('option');
    expect(results).toHaveLength(2);

    // First item should be active by default
    expect(results[0]).toHaveClass('active');
    expect(results[0]).toHaveAttribute('aria-selected', 'true');

    // Arrow down
    await user.keyboard('{ArrowDown}');
    expect(results[1]).toHaveClass('active');
    expect(results[1]).toHaveAttribute('aria-selected', 'true');
    expect(results[0]).not.toHaveClass('active');

    // Arrow up
    await user.keyboard('{ArrowUp}');
    expect(results[0]).toHaveClass('active');
    expect(results[1]).not.toHaveClass('active');
  });

  it('should have correct ARIA attributes', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const combobox = screen.getByRole('combobox');
    const input = screen.getByPlaceholderText(/Search ranks/i);

    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');

    await user.type(input, 'eagle');

    expect(input).toHaveAttribute('aria-controls', 'search-results-listbox');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
