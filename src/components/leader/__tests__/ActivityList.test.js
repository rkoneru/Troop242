/**
 * Tests for ActivityList component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityList from '../ActivityList';

describe('ActivityList', () => {
  const mockActivities = [
    {
      id: 'activity-1',
      title: 'Camping Trip',
      date: new Date('2026-04-15').toISOString(),
      time: '14:00',
      location: 'Camp Forested',
      description: 'Spring camping adventure',
      spots: 25,
      signedUp: [{ name: 'John Scout' }, { name: 'Jane Scout' }],
    },
    {
      id: 'activity-2',
      title: 'Hiking Day',
      date: new Date('2026-04-20').toISOString(),
      time: '10:00',
      location: 'Pine Trail',
      description: 'Morning hike',
      spots: 15,
      signedUp: [],
    },
  ];

  it('should display empty state when no items', () => {
    render(<ActivityList items={[]} />);

    expect(screen.getByText(/No activities/i)).toBeInTheDocument();
  });

  it('should display activities in list', () => {
    render(<ActivityList items={mockActivities} />);

    expect(screen.getByText('Camping Trip')).toBeInTheDocument();
    expect(screen.getByText('Hiking Day')).toBeInTheDocument();
  });

  it('should display activity details', () => {
    render(<ActivityList items={mockActivities} />);

    expect(screen.getByText('Camp Forested')).toBeInTheDocument();
    expect(screen.getByText('Spring camping adventure')).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 25/)).toBeInTheDocument();
  });

  it('should call onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const mockOnDelete = jest.fn();

    render(
      <ActivityList items={mockActivities} onDelete={mockOnDelete} />
    );

    const deleteButtons = screen.getAllByTitle('Delete');
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('activity-1');
  });

  it('should call onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    const mockOnEdit = jest.fn();

    render(
      <ActivityList items={mockActivities} onEdit={mockOnEdit} />
    );

    const editButtons = screen.getAllByTitle('Edit');
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockActivities[0]);
  });

  it('should toggle roster visibility', async () => {
    const user = userEvent.setup();

    render(
      <ActivityList items={mockActivities} />
    );

    const rosterButtons = screen.getAllByText(/Show Roster/i);
    await user.click(rosterButtons[0]);

    expect(screen.getByText(/John Scout/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Scout/)).toBeInTheDocument();
  });

  it('should not show roster toggle for empty signups', () => {
    render(
      <ActivityList items={[mockActivities[1]]} />
    );

    expect(screen.queryByText(/Show Roster/i)).not.toBeInTheDocument();
  });

  it('should display dues if present', () => {
    const itemsWithDues = [{
      ...mockActivities[0],
      dues: 50,
    }];

    render(<ActivityList items={itemsWithDues} />);

    expect(screen.getByText(/Dues: \$50/)).toBeInTheDocument();
  });
});
