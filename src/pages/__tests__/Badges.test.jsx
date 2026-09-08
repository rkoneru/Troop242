import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Badges from '../Badges';

describe('Badges Page Component', () => {
  it('should render page title and search bar', () => {
    render(<Badges />);

    expect(screen.getByRole('heading', { level: 1, name: /Merit Badges/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search categories.../i)).toBeInTheDocument();
  });

  it('should render merit badge categories', () => {
    render(<Badges />);

    expect(screen.getByText('Eagle Required')).toBeInTheDocument();
    expect(screen.getByText('Outdoor Adventures')).toBeInTheDocument();
  });

  it('should filter categories when user types in search input', async () => {
    const user = userEvent.setup();
    render(<Badges />);

    const searchInput = screen.getByPlaceholderText(/Search categories.../i);
    await user.type(searchInput, 'Robotics');

    expect(screen.getByText('Technology & Innovation')).toBeInTheDocument();
    expect(screen.queryByText('Outdoor Adventures')).not.toBeInTheDocument();
  });

  it('should show no badges found message when search yields no match', async () => {
    const user = userEvent.setup();
    render(<Badges />);

    const searchInput = screen.getByPlaceholderText(/Search categories.../i);
    await user.type(searchInput, 'nonexistentbadgename123');

    expect(screen.getByText(/No badges found matching "nonexistentbadgename123"/i)).toBeInTheDocument();
  });
});
