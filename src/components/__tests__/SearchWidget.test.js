import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchWidget from '../SearchWidget';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock search utility
jest.mock('../../utils/SearchIndex', () => ({
  search: jest.fn((query) => {
    if (query === 'eagle') {
      return [
        {
          title: 'Eagle Scout Rank',
          excerpt: 'Highest rank in Scouting',
          url: '/ranks',
          category: 'Rank',
          icon: '🦅',
        }
      ];
    }
    return [];
  }),
}));

describe('SearchWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any existing search state by re-rendering
  });

  const renderWidget = () => {
    return render(
      <MemoryRouter initialEntries={['/Troop242/']}>
        <SearchWidget />
      </MemoryRouter>
    );
  };

  it('opens search overlay when button is clicked', () => {
    renderWidget();
    const fab = screen.getByLabelText(/open search/i);
    fireEvent.click(fab);
    expect(screen.getByPlaceholderText(/search ranks/i)).toBeInTheDocument();
  });

  it('opens search overlay on Ctrl+K shortcut', () => {
    renderWidget();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByPlaceholderText(/search ranks/i)).toBeInTheDocument();
  });

  it('opens search overlay on Alt+S shortcut', () => {
    renderWidget();
    fireEvent.keyDown(window, { key: 's', altKey: true });
    expect(screen.getByPlaceholderText(/search ranks/i)).toBeInTheDocument();
  });

  it('closes search overlay on Escape key', async () => {
    renderWidget();
    fireEvent.click(screen.getByLabelText(/open search/i));
    const input = screen.getByPlaceholderText(/search ranks/i);
    expect(input).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitForElementToBeRemoved(() => screen.queryByPlaceholderText(/search ranks/i));
  });

  it('navigates results with arrow keys and Enter', () => {
    renderWidget();
    fireEvent.click(screen.getByLabelText(/open search/i));
    const input = screen.getByPlaceholderText(/search ranks/i);

    fireEvent.change(input, { target: { value: 'eagle' } });

    // Results should appear
    const resultItem = screen.getByRole('option', { name: /eagle scout rank/i });
    expect(resultItem).toBeInTheDocument();

    // Arrow Down to select
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(resultItem).toHaveAttribute('aria-selected', 'true');
    expect(resultItem).toHaveClass('active');

    // Enter to navigate
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/ranks');
  });
});
