import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

describe('SearchWidget Component', () => {
  it('renders floating search FAB button with accessibility attributes', () => {
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    const fabButton = screen.getByRole('button', { name: /Open search/i });
    expect(fabButton).toBeInTheDocument();
    expect(fabButton).toHaveAttribute('aria-haspopup', 'dialog');
    expect(fabButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens search overlay and renders search dialog attributes on click', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await user.click(fabButton);

    const dialog = screen.getByRole('dialog', { name: /Search site content/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const searchInput = screen.getByRole('searchbox', { name: /Search site content/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('id', 'search-widget-input');
  });

  it('allows clearing search query with dedicated clear button', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button', { name: /Open search/i }));

    const searchInput = screen.getByRole('searchbox', { name: /Search site content/i });
    await user.type(searchInput, 'Camping');

    expect(searchInput).toHaveValue('Camping');

    const clearButton = screen.getByRole('button', { name: /Clear search text/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(searchInput).toHaveFocus();
  });
});
