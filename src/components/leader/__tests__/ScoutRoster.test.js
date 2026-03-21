/**
 * Tests for ScoutRoster component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoutRoster from '../ScoutRoster';

// Mock the custom hook
jest.mock('../../../hooks/useFirebaseCollection', () => ({
  useFirebaseCollection: jest.fn(),
}));

import { useFirebaseCollection } from '../../../hooks/useFirebaseCollection';

describe('ScoutRoster', () => {
  const mockScouts = [
    { id: '1', name: 'John Scout', email: 'john@example.com', role: 'scout', rank: 'Star' },
    { id: '2', name: 'Jane Scout', email: 'jane@example.com', role: 'scout', rank: 'Life' },
    { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', rank: null },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useFirebaseCollection.mockReturnValue({
      data: mockScouts,
      loading: false,
      error: null,
    });
  });

  it('should display loading state initially', () => {
    useFirebaseCollection.mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    render(<ScoutRoster />);

    expect(screen.getByText(/Loading scouts/i)).toBeInTheDocument();
  });

  it('should display error state', () => {
    useFirebaseCollection.mockReturnValue({
      data: [],
      loading: false,
      error: new Error('Firestore error'),
    });

    render(<ScoutRoster />);

    expect(screen.getByText(/Error loading scouts/i)).toBeInTheDocument();
  });

  it('should display only scouts (not admins)', () => {
    render(<ScoutRoster />);

    expect(screen.getByText('John Scout')).toBeInTheDocument();
    expect(screen.getByText('Jane Scout')).toBeInTheDocument();
    expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
  });

  it('should display scout details', () => {
    render(<ScoutRoster />);

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should search scouts by name', async () => {
    const user = userEvent.setup();
    render(<ScoutRoster />);

    const searchInput = screen.getByPlaceholderText(/Search scouts/i);
    await user.type(searchInput, 'John');

    expect(screen.getByText('John Scout')).toBeInTheDocument();
    expect(screen.queryByText('Jane Scout')).not.toBeInTheDocument();
  });

  it('should search scouts by email', async () => {
    const user = userEvent.setup();
    render(<ScoutRoster />);

    const searchInput = screen.getByPlaceholderText(/Search scouts/i);
    await user.type(searchInput, 'jane@example.com');

    expect(screen.getByText('Jane Scout')).toBeInTheDocument();
    expect(screen.queryByText('John Scout')).not.toBeInTheDocument();
  });

  it('should call onAddScout when button clicked', async () => {
    const user = userEvent.setup();
    const mockOnAddScout = jest.fn();

    render(<ScoutRoster onAddScout={mockOnAddScout} />);

    const addButton = screen.getByText('Add Scout');
    await user.click(addButton);

    expect(mockOnAddScout).toHaveBeenCalled();
  });

  it('should call onSelectScout when scout clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelectScout = jest.fn();

    render(<ScoutRoster onSelectScout={mockOnSelectScout} />);

    const scoutCard = screen.getByText('John Scout').closest('[class*="card"]');
    await user.click(scoutCard);

    expect(mockOnSelectScout).toHaveBeenCalledWith(mockScouts[0]);
  });

  it('should show empty state when no scouts match search', async () => {
    const user = userEvent.setup();
    render(<ScoutRoster />);

    const searchInput = screen.getByPlaceholderText(/Search scouts/i);
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText(/No scouts found/i)).toBeInTheDocument();
  });

  it('should sort scouts alphabetically', () => {
    const unsortedScouts = [
      { id: '1', name: 'Zeke Scout', email: 'zeke@example.com', role: 'scout' },
      { id: '2', name: 'Alice Scout', email: 'alice@example.com', role: 'scout' },
      { id: '3', name: 'Bob Scout', email: 'bob@example.com', role: 'scout' },
    ];

    useFirebaseCollection.mockReturnValue({
      data: unsortedScouts,
      loading: false,
      error: null,
    });

    render(<ScoutRoster />);

    const scoutNames = screen.getAllByText(/Scout/).map(el => el.textContent);
    expect(scoutNames[0]).toContain('Alice');
    expect(scoutNames[1]).toContain('Bob');
    expect(scoutNames[2]).toContain('Zeke');
  });
});
