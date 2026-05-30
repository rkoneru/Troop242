import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import { search } from '../../utils/SearchIndex';

// Mock the search index
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(),
}));

describe('SearchWidget Debouncing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    search.mockClear();
    search.mockReturnValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('debounces search calls by 300ms', () => {
    render(
      <MemoryRouter initialEntries={['/Troop242/']}>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open the search modal
    const searchFab = screen.getByLabelText(/open search/i);
    fireEvent.click(searchFab);

    const input = screen.getByPlaceholderText(/search ranks, badges, events, skills/i);

    // Type "Eagle" rapidly
    fireEvent.change(input, { target: { value: 'E' } });
    fireEvent.change(input, { target: { value: 'Ea' } });
    fireEvent.change(input, { target: { value: 'Eag' } });
    fireEvent.change(input, { target: { value: 'Eagl' } });
    fireEvent.change(input, { target: { value: 'Eagle' } });

    // Search should NOT have been called yet
    expect(search).not.toHaveBeenCalled();

    // Fast-forward 150ms (still less than 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(search).not.toHaveBeenCalled();

    // Fast-forward another 150ms (total 300ms)
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Now it should have been called exactly once with the final value
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('Eagle');
  });

  test('does not search if query length is less than 2', () => {
    render(
      <MemoryRouter initialEntries={['/Troop242/']}>
        <SearchWidget />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/open search/i));
    const input = screen.getByPlaceholderText(/search ranks, badges, events, skills/i);

    fireEvent.change(input, { target: { value: 'A' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(search).not.toHaveBeenCalled();
  });
});
