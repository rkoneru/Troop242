import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import * as SearchIndex from '../../utils/SearchIndex';

// Mock the search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(),
}));

const mockResults = [
  { title: 'Result 1', excerpt: 'Excerpt 1', url: '/url1', category: 'Cat1', icon: '🔍' },
  { title: 'Result 2', excerpt: 'Excerpt 2', url: '/url2', category: 'Cat2', icon: '🔍' },
];

describe('SearchWidget Keyboard Navigation', () => {
  beforeEach(() => {
    SearchIndex.search.mockReturnValue(mockResults);
  });

  const renderSearchWidget = () => {
    return render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );
  };

  it('should open search when clicking the floating button', async () => {
    renderSearchWidget();
    const fab = screen.getByLabelText(/Open search/i);
    await userEvent.click(fab);
    expect(screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i)).toBeInTheDocument();
  });

  it('should navigate results using arrow keys', async () => {
    renderSearchWidget();
    // Open search
    await userEvent.click(screen.getByLabelText(/Open search/i));

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i);
    await userEvent.type(input, 'test');

    // Initially no result is active (-1)
    const items = screen.getAllByRole('option');
    expect(items[0]).not.toHaveClass('active');
    expect(items[1]).not.toHaveClass('active');

    // ArrowDown to first result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(items[0]).toHaveClass('active');
    expect(items[0]).toHaveAttribute('aria-selected', 'true');

    // ArrowDown to second result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(items[1]).toHaveClass('active');
    expect(items[1]).toHaveAttribute('aria-selected', 'true');

    // ArrowDown wraps to first result
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(items[0]).toHaveClass('active');

    // ArrowUp wraps to last result
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(items[1]).toHaveClass('active');
  });

  it('should select the active result on Enter', async () => {
    renderSearchWidget();
    await userEvent.click(screen.getByLabelText(/Open search/i));

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i);
    await userEvent.type(input, 'test');

    // ArrowDown to first result
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Enter to select
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 });

    // Overlay should be closed
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Search ranks, badges, events, skills.../i)).not.toBeInTheDocument();
    });
  });

  it('should reset activeIndex when query changes', async () => {
    renderSearchWidget();
    await userEvent.click(screen.getByLabelText(/Open search/i));

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i);
    await userEvent.type(input, 'test');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const items = screen.getAllByRole('option');
    expect(items[0]).toHaveClass('active');

    // Change query
    await userEvent.type(input, 'a');

    // items might be re-rendered, get them again
    const newItems = screen.getAllByRole('option');
    expect(newItems[0]).not.toHaveClass('active');
  });
});
