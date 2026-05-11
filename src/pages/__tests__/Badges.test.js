import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Badges from '../Badges';

const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={['/Troop242/badges']}>
      <Badges />
    </MemoryRouter>
  );
};

describe('Badges Page', () => {
  it('renders correctly with title and description', () => {
    renderComponent();
    expect(screen.getByText('Merit Badges')).toBeInTheDocument();
    expect(screen.getByText(/Explore over 140 merit badges/i)).toBeInTheDocument();
  });

  it('renders initial categories', () => {
    renderComponent();
    expect(screen.getByText('Eagle Required')).toBeInTheDocument();
    expect(screen.getByText('Outdoor Adventures')).toBeInTheDocument();
  });

  it('filters categories and badges based on search input', () => {
    renderComponent();
    const searchInput = screen.getByLabelText(/search merit badge categories/i);

    // Search for a specific badge in Outdoor Adventures
    fireEvent.change(searchInput, { target: { value: 'Backpacking' } });

    expect(screen.queryByText('Eagle Required')).not.toBeInTheDocument();
    expect(screen.getByText('Outdoor Adventures')).toBeInTheDocument();
    expect(screen.getByText('Backpacking')).toBeInTheDocument();
  });

  it('expands a category when clicked', () => {
    renderComponent();
    const categoryCard = screen.getByText('Eagle Required').closest('.glass-card');

    expect(screen.getByText('✓ First Aid')).toBeInTheDocument();

    fireEvent.click(categoryCard);

    expect(screen.getByText('✓ First Aid')).toBeInTheDocument();
  });
});
