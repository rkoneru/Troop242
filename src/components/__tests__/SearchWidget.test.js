import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

describe('SearchWidget', () => {
  it('renders the floating search button with correct ARIA label', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    const openBtn = screen.getByRole('button', { name: /Open search/i });
    expect(openBtn).toBeInTheDocument();
  });

  it('opens search overlay dialog when search button is clicked', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    const openBtn = screen.getByRole('button', { name: /Open search/i });
    fireEvent.click(openBtn);

    const dialog = screen.getByRole('dialog', { name: /Search site/i });
    expect(dialog).toBeInTheDocument();

    const searchInput = screen.getByRole('searchbox', { name: /Search ranks, badges, events, skills/i });
    expect(searchInput).toBeInTheDocument();
  });

  it('opens search overlay dialog on Ctrl+K keyboard shortcut', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /Search site/i })).toBeInTheDocument();
  });

  it('closes search overlay dialog on Escape key press', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open search/i }));
    expect(screen.getByRole('dialog', { name: /Search site/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Search site/i })).not.toBeInTheDocument();
  });

  it('populates search query when suggestion button is clicked', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open search/i }));

    const suggestionBtn = screen.getByRole('button', { name: /Search for Eagle Scout/i });
    expect(suggestionBtn).toBeInTheDocument();

    fireEvent.click(suggestionBtn);

    const searchInput = screen.getByRole('searchbox', { name: /Search ranks, badges, events, skills/i });
    expect(searchInput.value).toBe('Eagle Scout');
  });

  it('closes search modal when close button is clicked', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open search/i }));
    expect(screen.getByRole('dialog', { name: /Search site/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Close search/i }));
    expect(screen.queryByRole('dialog', { name: /Search site/i })).not.toBeInTheDocument();
  });
});
