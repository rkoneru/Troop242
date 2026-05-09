import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import { search } from '../../utils/SearchIndex';

// Mock the search utility
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(),
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderSearchWidget = () => {
    return render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );
  };

  test('opens search on Ctrl+K', () => {
    renderSearchWidget();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByPlaceholderText(/Search ranks/)).toBeInTheDocument();
  });

  test('opens search on Alt+S', () => {
    renderSearchWidget();
    fireEvent.keyDown(window, { key: 's', altKey: true });
    expect(screen.getByPlaceholderText(/Search ranks/)).toBeInTheDocument();
  });

  test('navigates results with arrow keys', async () => {
    search.mockReturnValue([
      { title: 'Result 1', excerpt: 'Excerpt 1', url: '/url1', category: 'Cat1', icon: '🔍' },
      { title: 'Result 2', excerpt: 'Excerpt 2', url: '/url2', category: 'Cat2', icon: '🔍' },
    ]);

    renderSearchWidget();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const input = screen.getByPlaceholderText(/Search ranks/);
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => expect(screen.getByText('Result 1')).toBeInTheDocument());

    const result1 = screen.getByText('Result 1').closest('button');
    const result2 = screen.getByText('Result 2').closest('button');

    // Initially none are active
    expect(result1).not.toHaveClass('active');
    expect(result2).not.toHaveClass('active');

    // ArrowDown to first item
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(result1).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'search-result-0');

    // ArrowDown to second item
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(result2).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'search-result-1');

    // ArrowUp back to first item
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(result1).toHaveClass('active');
    expect(input).toHaveAttribute('aria-activedescendant', 'search-result-0');
  });
});
