import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchWidget from '../SearchWidget';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query.toLowerCase().includes('eagle')) {
      return [
        { title: 'Eagle Scout Rank', excerpt: 'The highest rank in Scouting America', category: 'Ranks', url: '/ranks', icon: '🦅' },
        { title: 'Eagle Project Guide', excerpt: 'Leadership service project guidelines', category: 'Guide', url: '/guide/eagle', icon: '📋' }
      ];
    }
    return [];
  })
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders floating search button with appropriate ARIA attributes', () => {
    render(<SearchWidget />);
    const fab = screen.getByRole('button', { name: /open search/i });
    expect(fab).toBeInTheDocument();
    expect(fab).toHaveAttribute('aria-haspopup', 'dialog');
    expect(fab).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens modal when floating search button is clicked', async () => {
    render(<SearchWidget />);
    const fab = screen.getByRole('button', { name: /open search/i });
    fireEvent.click(fab);

    const dialog = await screen.findByRole('dialog', { name: /search site content/i });
    expect(dialog).toBeInTheDocument();
    expect(fab).toHaveAttribute('aria-expanded', 'true');
  });

  test('opens modal when Ctrl+K / Cmd+K shortcut is pressed', async () => {
    render(<SearchWidget />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const dialog = await screen.findByRole('dialog', { name: /search site content/i });
    expect(dialog).toBeInTheDocument();
  });

  test('opens modal when open-search custom event is dispatched', async () => {
    render(<SearchWidget />);
    fireEvent(window, new CustomEvent('open-search'));

    const dialog = await screen.findByRole('dialog', { name: /search site content/i });
    expect(dialog).toBeInTheDocument();
  });

  test('performs search, shows results with ARIA listbox roles, and navigates on result click', async () => {
    const user = userEvent.setup();
    render(<SearchWidget />);

    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    const searchInput = await screen.findByPlaceholderText(/search ranks, badges/i);
    await user.type(searchInput, 'Eagle');

    const listbox = await screen.findByRole('listbox', { name: /search results/i });
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Eagle Scout Rank');

    await user.click(options[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/ranks');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('supports clearing query via clear button', async () => {
    const user = userEvent.setup();
    render(<SearchWidget />);

    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    const searchInput = await screen.findByPlaceholderText(/search ranks, badges/i);
    await user.type(searchInput, 'Eagle');

    const clearBtn = await screen.findByRole('button', { name: /clear search query/i });
    await user.click(clearBtn);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('supports ArrowDown / ArrowUp / Enter keyboard navigation across search results', async () => {
    render(<SearchWidget />);

    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    const searchInput = await screen.findByPlaceholderText(/search ranks, badges/i);
    fireEvent.change(searchInput, { target: { value: 'Eagle' } });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const options = screen.getAllByRole('option');

    // Press ArrowDown -> select first item
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');

    // Press ArrowDown -> select second item
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // Press Enter -> select current item and navigate
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/guide/eagle');
  });

  test('closes dialog on Escape key press', async () => {
    render(<SearchWidget />);

    fireEvent.click(screen.getByRole('button', { name: /open search/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
