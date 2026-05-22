import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import { search } from '../../utils/SearchIndex';

// Mock the search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(() => []),
}));

const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={['/Troop242/']}>
      <SearchWidget />
    </MemoryRouter>
  );
};

describe('SearchWidget Debounce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce search calls', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderComponent();

    // Open the search widget
    const searchButton = screen.getByLabelText(/Open search/i);
    await user.click(searchButton);

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills/i);

    // Type rapidly
    await user.type(input, 'camp');

    // Should not have called search yet
    expect(search).not.toHaveBeenCalled();

    // Advance time by 200ms (less than 300ms debounce)
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(search).not.toHaveBeenCalled();

    // Advance time by another 200ms (total 400ms)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(search).toHaveBeenCalledWith('camp');
    expect(search).toHaveBeenCalledTimes(1);
  });
});
