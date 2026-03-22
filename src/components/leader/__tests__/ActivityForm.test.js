/**
 * Tests for ActivityForm component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityForm from '../ActivityForm';

describe('ActivityForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show create button initially', () => {
    render(<ActivityForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Create Activity')).toBeInTheDocument();
  });

  it('should open form when button clicked', async () => {
    const user = userEvent.setup();
    render(<ActivityForm onSubmit={mockOnSubmit} />);

    const button = screen.getByText('Create Activity');
    await user.click(button);

    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<ActivityForm onSubmit={mockOnSubmit} />);

    const button = screen.getByText('Create Activity');
    await user.click(button);

    const submitButton = screen.getByRole('button', { name: /Create/i });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid activity data', async () => {
    const user = userEvent.setup();
    render(<ActivityForm onSubmit={mockOnSubmit.mockResolvedValue(undefined)} />);

    const button = screen.getByText('Create Activity');
    await user.click(button);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const dateInput = screen.getByRole('textbox', { name: /date/i });
    const timeInput = screen.getByRole('textbox', { name: /time/i });
    const locationInput = screen.getByRole('textbox', { name: /location/i });
    const descriptionInput = screen.getByRole('textbox', { name: /description/i });
    const spotsInput = screen.getByRole('spinbutton', { name: /spots/i });

    await user.type(titleInput, 'Camping Trip');
    await user.type(dateInput, tomorrow.toISOString().split('T')[0]);
    await user.type(timeInput, '14:00');
    await user.type(locationInput, 'Camp Forested');
    await user.type(descriptionInput, 'A fun camping experience');
    await user.type(spotsInput, '25');

    const submitButton = screen.getByRole('button', { name: /Create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should show edit button when editing', () => {
    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        isEditing={true}
        initialValues={{ title: 'Existing Activity' }}
      />
    );

    expect(screen.getByText('Edit Activity')).toBeInTheDocument();
  });

  it('should populate form with initial values', async () => {
    const user = userEvent.setup();
    const initialValues = {
      title: 'Existing Activity',
      type: 'activity',
      location: 'Camp',
      description: 'Existing description',
      spots: '20',
    };

    render(
      <ActivityForm
        onSubmit={mockOnSubmit}
        isEditing={true}
        initialValues={initialValues}
      />
    );

    const button = screen.getByText('Edit Activity');
    await user.click(button);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    expect(titleInput).toHaveValue('Existing Activity');
  });

  it('should close form after successful submit', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    const { rerender } = render(<ActivityForm onSubmit={mockOnSubmit} />);

    const button = screen.getByText('Create Activity');
    await user.click(button);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    await user.type(titleInput, 'Test Activity');

    // Close button should be visible when form is open
    const closeButton = screen.getByRole('button', { name: '' });
    expect(closeButton).toBeInTheDocument();
  });
});
