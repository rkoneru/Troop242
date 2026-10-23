import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

// Mock search function from SearchIndex
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query.toLowerCase().includes('eagle')) {
      return [
        {
          title: 'Eagle Scout Rank',
          excerpt: 'Learn about Eagle Scout requirements and trail.',
          category: 'Ranks',
          icon: '🦅',
          url: '/ranks',
        },
      ];
    }
    return [];
  }),
}));

describe('SearchWidget', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

  it('renders search FAB with accessibility attributes', () => {
    renderComponent();
    const fabButton = screen.getByRole('button', { name: /Open search/i });
    expect(fabButton).toBeInTheDocument();
    expect(fabButton).toHaveAttribute('aria-haspopup', 'dialog');
    expect(fabButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens search overlay and focuses input on button click', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await user.click(fabButton);

    const dialog = screen.getByRole('dialog', { name: /Search site content/i });
    expect(dialog).toBeInTheDocument();

    const input = screen.getByRole('searchbox', { name: /Search site content/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'search-widget-input');
    expect(input).toHaveAttribute('aria-controls', 'search-results');
  });

  it('populates search query and refocuses input when suggestion button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await user.click(fabButton);

    const suggestionButton = screen.getByRole('button', { name: /Search for Eagle Scout/i });
    await user.click(suggestionButton);

    const input = screen.getByRole('searchbox', { name: /Search site content/i });
    expect(input).toHaveValue('Eagle Scout');
    expect(document.activeElement).toBe(input);
  });

  it('clears search query and refocuses input when clear button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await user.click(fabButton);

    const input = screen.getByRole('searchbox', { name: /Search site content/i });
    await user.type(input, 'Eagle');

    const clearButton = screen.getByRole('button', { name: /Clear search query/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(input).toHaveValue('');
    expect(document.activeElement).toBe(input);
  });
});
