import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import { search } from '../../utils/SearchIndex';

// Mock the search utility
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn()
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('opens search panel when search button is clicked', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    const searchBtn = screen.getByLabelText(/Open search/i);
    fireEvent.click(searchBtn);

    expect(screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i)).toBeInTheDocument();
  });

  test('performs search when query is entered', async () => {
    search.mockReturnValue([{ title: 'Test Result', excerpt: 'Test excerpt', url: '/test', category: 'Test', icon: '🔍' }]);

    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/Open search/i));

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i);
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(search).toHaveBeenCalledWith('test');
    });

    expect(screen.getByText('Test Result')).toBeInTheDocument();
  });

  test('debounces search calls', async () => {
    jest.useFakeTimers();
    search.mockReturnValue([]);

    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/Open search/i));

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i);

    // Simulate typing 'abc' rapidly
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });

    // Should not have called search immediately
    expect(search).not.toHaveBeenCalled();

    // Fast-forward 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now it should have been called once with the final value
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('abc');

    jest.useRealTimers();
  });
});
