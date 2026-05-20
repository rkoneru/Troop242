import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import { search } from '../../utils/SearchIndex';

// Mock the search utility
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(() => []),
}));

describe('SearchWidget Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces search input to 300ms', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    // Open the search widget
    const searchButton = screen.getByLabelText(/Open search/i);
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i);

    // Type "eagle" quickly
    fireEvent.change(input, { target: { value: 'e' } });
    fireEvent.change(input, { target: { value: 'ea' } });
    fireEvent.change(input, { target: { value: 'eag' } });
    fireEvent.change(input, { target: { value: 'eagl' } });
    fireEvent.change(input, { target: { value: 'eagle' } });

    // Should not have called search yet
    expect(search).not.toHaveBeenCalled();

    // Advance time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should be called exactly once with the final value
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('eagle');
  });

  it('triggers separate searches if time between typing exceeds 300ms', () => {
    render(
      <MemoryRouter>
        <SearchWidget />
      </MemoryRouter>
    );

    const searchButton = screen.getByLabelText(/Open search/i);
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills.../i);

    // Type "first"
    fireEvent.change(input, { target: { value: 'fi' } });
    fireEvent.change(input, { target: { value: 'fir' } });
    fireEvent.change(input, { target: { value: 'firs' } });
    fireEvent.change(input, { target: { value: 'first' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('first');

    // Wait a bit and type " aid"
    fireEvent.change(input, { target: { value: 'first aid' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(search).toHaveBeenCalledTimes(2);
    expect(search).toHaveBeenCalledWith('first aid');
  });
});
