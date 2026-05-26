import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import { search } from '../../utils/SearchIndex';

// Mock the search utility
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(() => [])
}));

describe('SearchWidget Debouncing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should debounce search calls', async () => {
    render(
      <MemoryRouter initialEntries={['/Troop242/']}>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open search overlay
    const searchButton = screen.getByLabelText(/open search/i);
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/search ranks, badges, events, skills/i);

    // Simulate rapid typing
    fireEvent.change(input, { target: { value: 'e' } });
    fireEvent.change(input, { target: { value: 'ea' } });
    fireEvent.change(input, { target: { value: 'eag' } });

    // Search should not have been called yet because of the 300ms debounce
    expect(search).not.toHaveBeenCalled();

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Search should be called exactly once with the final value
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('eag');
  });

  test('should not search if query length is less than 2', () => {
    render(
      <MemoryRouter initialEntries={['/Troop242/']}>
        <SearchWidget />
      </MemoryRouter>
    );

    const searchButton = screen.getByLabelText(/open search/i);
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/search ranks, badges, events, skills/i);

    fireEvent.change(input, { target: { value: 'e' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(search).not.toHaveBeenCalled();
  });
});
