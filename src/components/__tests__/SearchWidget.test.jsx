
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';
import { search } from '../../utils/SearchIndex';
import '@testing-library/jest-dom';

// Mock the search function
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn(() => [])
}));

describe('SearchWidget Debouncing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderWidget = () => {
    return render(
      <BrowserRouter>
        <SearchWidget />
      </BrowserRouter>
    );
  };

  it('should not call search immediately on keystroke', () => {
    renderWidget();

    // Open the search overlay
    fireEvent.click(screen.getByLabelText(/Open search/i));

    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills/i);

    // Type something
    fireEvent.change(input, { target: { value: 'Eagle' } });

    // Search should not have been called yet because of debounce
    expect(search).not.toHaveBeenCalled();

    // Fast-forward 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(search).not.toHaveBeenCalled();

    // Fast-forward another 250ms (total 350ms, past the 300ms delay)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(search).toHaveBeenCalledWith('Eagle');
  });

  it('should only call search once for multiple rapid keystrokes', () => {
    renderWidget();

    fireEvent.click(screen.getByLabelText(/Open search/i));
    const input = screen.getByPlaceholderText(/Search ranks, badges, events, skills/i);

    // Rapid typing
    fireEvent.change(input, { target: { value: 'E' } });
    fireEvent.change(input, { target: { value: 'Ea' } });
    fireEvent.change(input, { target: { value: 'Eag' } });
    fireEvent.change(input, { target: { value: 'Eagl' } });
    fireEvent.change(input, { target: { value: 'Eagle' } });

    // Should not have been called yet
    expect(search).not.toHaveBeenCalled();

    // Advance time
    act(() => {
      jest.advanceTimersByTime(350);
    });

    // Should be called only once with the final value
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('Eagle');
  });
});
