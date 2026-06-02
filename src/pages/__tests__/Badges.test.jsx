import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Badges from '../Badges';
import '@testing-library/jest-dom';

// Mock scrollToTop
jest.mock('../../utils/scrollToTop', () => ({
  scrollToTop: jest.fn(),
}));

describe('Badges Component', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Badges />
      </MemoryRouter>
    );

  test('renders the Badges page with title and search input', () => {
    renderComponent();
    // Use getAllByText for title if there are multiple occurrences (hero + maybe somewhere else)
    expect(screen.getAllByText(/Merit Badges/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Search categories.../i)).toBeInTheDocument();
  });

  test('filters categories based on search term', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Search categories.../i);

    // Search for "Outdoor Adventures" category
    fireEvent.change(searchInput, { target: { value: 'Outdoor Adventures' } });

    expect(screen.getByText(/Outdoor Adventures/i)).toBeInTheDocument();

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'NonExistentBadge' } });
    expect(screen.getByText(/No badges found matching "NonExistentBadge"/i)).toBeInTheDocument();
  });

  test('expands a category when clicked', () => {
    renderComponent();

    // "Technology & Innovation" is a category
    const techCategory = screen.getByText(/Technology & Innovation/i).closest('.glass-card');

    fireEvent.click(techCategory);

    // "Programming" is a badge in that category.
    expect(screen.getAllByText(/Programming/i).length).toBeGreaterThan(0);
  });
});
