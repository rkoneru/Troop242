import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import * as SearchIndex from '../../utils/SearchIndex';

// Mock SearchIndex
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(() => [
    { title: 'Eagle Scout', excerpt: 'Highest rank', url: '/ranks', category: 'Rank', icon: '🦅' }
  ]),
}));

describe('SearchWidget Debouncing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should debounce search calls', async () => {
    render(
      <MemoryRouter initialEntries={['/Troop242/']}>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open search
    const searchBtn = screen.getByLabelText(/open search/i);
    fireEvent.click(searchBtn);

    const input = screen.getByPlaceholderText(/search ranks, badges, events, skills.../i);

    // Type rapidly
    fireEvent.change(input, { target: { value: 'E' } });
    fireEvent.change(input, { target: { value: 'Ea' } });
    fireEvent.change(input, { target: { value: 'Eag' } });

    // Search should not have been called yet
    expect(SearchIndex.search).not.toHaveBeenCalled();

    // Advance timers by 200ms (less than 300ms debounce)
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(SearchIndex.search).not.toHaveBeenCalled();

    // Advance by another 100ms (total 300ms)
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Now search should have been called exactly once
    expect(SearchIndex.search).toHaveBeenCalledTimes(1);
    expect(SearchIndex.search).toHaveBeenCalledWith('Eag');

    // Results should be visible
    expect(await screen.findByText('Eagle Scout')).toBeInTheDocument();
  });
});
