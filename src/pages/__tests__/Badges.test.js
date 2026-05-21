import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Badges from '../Badges';

describe('Badges', () => {
  it('should render the badges page', () => {
    render(
      <MemoryRouter initialEntries={['/Troop242/badges']}>
        <Badges />
      </MemoryRouter>
    );
    // Use getAllByText and check if at least one exists because the text appears multiple times (hero, about section)
    const badgeHeaders = screen.getAllByText(/Merit Badges/i);
    expect(badgeHeaders.length).toBeGreaterThan(0);
  });

  it('should filter badges based on search term', () => {
    render(
      <MemoryRouter initialEntries={['/Troop242/badges']}>
        <Badges />
      </MemoryRouter>
    );

    const searchInput = screen.getByLabelText(/search merit badge categories/i);
    fireEvent.change(searchInput, { target: { value: 'Camping' } });

    expect(screen.getByText(/Eagle Required/i)).toBeInTheDocument();
    expect(screen.getByText(/Camping/i)).toBeInTheDocument();
  });
});
