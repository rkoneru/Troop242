import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock SearchIndex
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query.toLowerCase().includes('eagle')) {
      return [
        {
          title: 'Eagle Rank',
          excerpt: 'Eagle Scout is the highest rank achievable in Scouting BSA.',
          category: 'Ranks',
          url: '/ranks',
          icon: '🦅',
        },
      ];
    }
    return [];
  }),
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWidget = () => {
    return render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );
  };

  it('renders the floating search button with proper ARIA attributes', () => {
    renderWidget();
    const fabButton = screen.getByRole('button', { name: /Open search/i });
    expect(fabButton).toBeInTheDocument();
    expect(fabButton).toHaveAttribute('type', 'button');
    expect(fabButton).toHaveAttribute('aria-haspopup', 'dialog');
    expect(fabButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens search modal on search button click with proper dialog role and attributes', async () => {
    renderWidget();
    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await userEvent.click(fabButton);

    const dialog = screen.getByRole('dialog', { name: /Search site/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const searchInput = screen.getByRole('searchbox', { name: /Search site content/i });
    expect(searchInput).toBeInTheDocument();
  });

  it('displays search results when query is entered', async () => {
    renderWidget();
    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await userEvent.click(fabButton);

    const searchInput = screen.getByRole('searchbox', { name: /Search site content/i });
    await userEvent.type(searchInput, 'Eagle');

    await waitFor(() => {
      expect(screen.getByText('Eagle Rank')).toBeInTheDocument();
    });

    const resultsRegion = screen.getByRole('region', { name: /Search results/i });
    expect(resultsRegion).toHaveAttribute('aria-live', 'polite');

    const resultItem = screen.getByRole('button', { name: /Eagle Rank/i });
    await userEvent.click(resultItem);

    expect(mockNavigate).toHaveBeenCalledWith('/ranks');
  });

  it('displays empty status message when no results are found', async () => {
    renderWidget();
    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await userEvent.click(fabButton);

    const searchInput = screen.getByRole('searchbox', { name: /Search site content/i });
    await userEvent.type(searchInput, 'xyzxyz');

    await waitFor(() => {
      const emptyStatus = screen.getByRole('status');
      expect(emptyStatus).toBeInTheDocument();
      expect(emptyStatus).toHaveTextContent('No results for "xyzxyz"');
    });
  });

  it('closes search modal when close button is clicked', async () => {
    renderWidget();
    const fabButton = screen.getByRole('button', { name: /Open search/i });
    await userEvent.click(fabButton);

    const closeBtn = screen.getByRole('button', { name: /Close search/i });
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('opens search modal on Ctrl+K keypress and closes on Escape keypress', async () => {
    renderWidget();

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
