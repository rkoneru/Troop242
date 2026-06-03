import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import * as SearchIndex from '../../utils/SearchIndex';

// Mock the search index
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(() => []),
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debounces search calls on rapid keystrokes', () => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );

    // Open the search widget
    const fab = screen.getByLabelText(/open search/i);
    fireEvent.click(fab);

    const input = screen.getByPlaceholderText(/search ranks/i);

    // Simulate typing 'abc' rapidly
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });

    // Should not have called search yet
    expect(SearchIndex.search).not.toHaveBeenCalled();

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should have called search only once with the final value
    expect(SearchIndex.search).toHaveBeenCalledTimes(1);
    expect(SearchIndex.search).toHaveBeenCalledWith('abc');

    jest.useRealTimers();
  });
});
