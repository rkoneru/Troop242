import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CampingGuide from '../CampingGuide';

describe('CampingGuide Component', () => {
  test('renders camping guide title and main sections', () => {
    render(<CampingGuide />);
    expect(screen.getByText(/Troop 242 Camping Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete Camping Checklist/i)).toBeInTheDocument();
  });

  test('accordion buttons have proper ARIA attributes and toggle content', () => {
    render(<CampingGuide />);

    const shelterButton = screen.getByRole('button', { name: /Shelter & Sleep/i });
    expect(shelterButton).toHaveAttribute('aria-expanded', 'false');
    expect(shelterButton).toHaveAttribute('aria-controls', 'checklist-content-0');

    // Content should initially not be visible
    expect(screen.queryByText(/✓ Tent with rainfly and stakes/i)).not.toBeInTheDocument();

    // Click to expand accordion
    fireEvent.click(shelterButton);
    expect(shelterButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/✓ Tent with rainfly and stakes/i)).toBeInTheDocument();

    const region = screen.getByRole('region', { name: /Shelter & Sleep/i });
    expect(region).toHaveAttribute('id', 'checklist-content-0');

    // Click again to collapse
    fireEvent.click(shelterButton);
    expect(shelterButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/✓ Tent with rainfly and stakes/i)).not.toBeInTheDocument();
  });
});
