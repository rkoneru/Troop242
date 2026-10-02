/**
 * Unit tests for Appearance component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Appearance from '../Appearance';

// Mock IntersectionObserver for Framer Motion whileInView
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Appearance Page', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders page header and section titles correctly', () => {
    render(<Appearance />);

    expect(screen.getByRole('heading', { name: /🎨 Appearance/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /General Colors/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Scout Colors/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /UI Framework/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Theme Information/i })).toBeInTheDocument();
  });

  it('renders general color themes and scout color themes', () => {
    render(<Appearance />);

    // General color theme titles
    expect(screen.getByText('Current (Dark)')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();

    // Scout color theme titles
    expect(screen.getByText('Scout Green')).toBeInTheDocument();
    expect(screen.getByText('Scout Tan')).toBeInTheDocument();
    expect(screen.getByText('Scout Blue')).toBeInTheDocument();
  });

  it('allows changing theme and persists preference to localStorage', async () => {
    const user = userEvent.setup();
    render(<Appearance />);

    const lightThemeCard = screen.getByText('Light').closest('.glass-card');
    await user.click(lightThemeCard);

    expect(localStorage.getItem('troopTheme')).toBe('white');
  });

  it('allows changing UI framework and persists preference to localStorage', async () => {
    const user = userEvent.setup();
    render(<Appearance />);

    const glassFrameworkCard = screen.getByText(/Glassmorphism/i).closest('.glass-card');
    await user.click(glassFrameworkCard);

    expect(localStorage.getItem('troopFramework')).toBe('glass');
  });
});
