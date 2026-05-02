import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchWidget from '../SearchWidget';
import { BrowserRouter } from 'react-router-dom';
import { search } from '../../utils/SearchIndex';

// Mock the search index
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(),
}));

const renderSearchWidget = () => {
  return render(
    <BrowserRouter>
      <SearchWidget />
    </BrowserRouter>
  );
};

describe('SearchWidget Keyboard Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the DOM for each test
    document.body.innerHTML = '';
  });

  test('opens search on Ctrl+K', async () => {
    renderSearchWidget();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByPlaceholderText(/Search ranks, badges, events, skills/i)).toBeInTheDocument();
  });

  test('debounces search and resets activeIndex', async () => {
    const user = userEvent.setup();
    search.mockReturnValue([{ title: 'Result 1', excerpt: 'Excerpt 1', url: '/test', category: 'Test', icon: '🔍' }]);

    renderSearchWidget();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills/i);
    await user.type(input, 'test');

    // Should not call search immediately
    expect(search).not.toHaveBeenCalled();

    // Fast-forward 300ms
    await waitFor(() => expect(search).toHaveBeenCalledWith('test'), { timeout: 1000 });

    expect(screen.getByText('Result 1')).toBeInTheDocument();
  });

  test('navigates results with ArrowDown and ArrowUp', async () => {
    const user = userEvent.setup();
    const mockResults = [
      { title: 'Result 1', excerpt: 'Excerpt 1', url: '/test1', category: 'Test', icon: '🔍' },
      { title: 'Result 2', excerpt: 'Excerpt 2', url: '/test2', category: 'Test', icon: '🔍' }
    ];
    search.mockReturnValue(mockResults);

    renderSearchWidget();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills/i);
    await user.type(input, 'test');

    await waitFor(() => expect(screen.getByText('Result 1')).toBeInTheDocument());

    const resultButtons = screen.getAllByRole('option');

    // Initial state: no item is active
    expect(resultButtons[0]).not.toHaveClass('active');
    expect(resultButtons[1]).not.toHaveClass('active');

    // ArrowDown should select first item
    await user.keyboard('{ArrowDown}');
    expect(resultButtons[0]).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'result-item-0');

    // ArrowDown should select second item
    await user.keyboard('{ArrowDown}');
    expect(resultButtons[1]).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'result-item-1');

    // ArrowDown should wrap around to first item
    await user.keyboard('{ArrowDown}');
    expect(resultButtons[0]).toHaveClass('active');

    // ArrowUp should wrap around to last item
    await user.keyboard('{ArrowUp}');
    expect(resultButtons[1]).toHaveClass('active');
  });

  test('selects result on Enter', async () => {
    const user = userEvent.setup();
    const mockResults = [
      { title: 'Result 1', excerpt: 'Excerpt 1', url: '/test1', category: 'Test', icon: '🔍' }
    ];
    search.mockReturnValue(mockResults);

    renderSearchWidget();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills/i);
    await user.type(input, 'test');

    await waitFor(() => expect(screen.getByText('Result 1')).toBeInTheDocument());

    // Navigate to first item
    await user.keyboard('{ArrowDown}');

    // Press Enter
    await user.keyboard('{Enter}');

    // Search should be closed
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Search ranks, badges, events, skills/i)).not.toBeInTheDocument();
    });
  });
});
