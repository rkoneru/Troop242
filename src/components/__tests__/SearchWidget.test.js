import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query === 'eagle') {
      return [
        { title: 'Eagle Scout Rank', excerpt: 'The highest rank...', url: '/ranks', category: 'Rank', icon: '🦅' },
        { title: 'Eagle Project', excerpt: 'Planning your project...', url: '/ranks', category: 'Page', icon: '📋' }
      ];
    }
    return [];
  }),
}));

describe('SearchWidget Keyboard Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset JSDOM
    document.body.innerHTML = '';
  });

  const renderSearchWidget = () => {
    return render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );
  };

  test('opens search overlay on Alt+S', () => {
    renderSearchWidget();
    fireEvent.keyDown(window, { key: 's', altKey: true });
    expect(screen.getByPlaceholderText(/Search ranks/)).toBeInTheDocument();
  });

  test('navigates results with arrow keys', async () => {
    renderSearchWidget();
    fireEvent.click(screen.getByLabelText(/Open search/));

    const input = screen.getByPlaceholderText(/Search ranks/);
    fireEvent.change(input, { target: { value: 'eagle' } });

    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    const options = screen.getAllByRole('option');

    // Initial state: no selection
    expect(options[0]).not.toHaveClass('active');
    expect(options[1]).not.toHaveClass('active');

    // ArrowDown to first result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(options[0]).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'search-result-0');

    // ArrowDown to second result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(options[1]).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'search-result-1');

    // ArrowUp back to first result
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(options[0]).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'search-result-0');
  });

  test('selects result on Enter', async () => {
    renderSearchWidget();
    fireEvent.click(screen.getByLabelText(/Open search/));

    const input = screen.getByPlaceholderText(/Search ranks/);
    fireEvent.change(input, { target: { value: 'eagle' } });

    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    fireEvent.keyDown(input, { key: 'ArrowDown' }); // Select first result
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/ranks');
    });

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Search ranks/)).not.toBeInTheDocument();
    });
  });
});
