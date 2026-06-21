import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import * as SearchIndex from '../../utils/SearchIndex';

// Mock the search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(),
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SearchIndex.search.mockReturnValue([]);
  });

  it('should debounce search calls', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open search
    const searchButton = screen.getByLabelText(/open search/i);
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/search ranks, badges, events, skills/i);

    // Type quickly
    fireEvent.change(input, { target: { value: 'e' } });
    fireEvent.change(input, { target: { value: 'ea' } });
    fireEvent.change(input, { target: { value: 'eag' } });

    // Search should not have been called yet because it's debounced
    expect(SearchIndex.search).not.toHaveBeenCalled();

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now it should have been called once with the latest value
    expect(SearchIndex.search).toHaveBeenCalledTimes(1);
    expect(SearchIndex.search).toHaveBeenCalledWith('eag');

    jest.useRealTimers();
  });
});
