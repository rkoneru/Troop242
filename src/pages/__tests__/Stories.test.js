import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Stories from '../Stories';

// Mock framer-motion using require inside factory
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, whileInView, viewport, initial, animate, transition, variants, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
    },
  };
});

describe('Stories Component Accessibility', () => {
  it('renders story cards with accessible button roles and ARIA attributes', () => {
    render(<Stories />);

    const marcusCard = screen.getByRole('button', { name: /Marcus Johnson, Eagle Scout story/i });
    expect(marcusCard).toBeInTheDocument();
    expect(marcusCard).toHaveAttribute('tabIndex', '0');
    expect(marcusCard).toHaveAttribute('aria-expanded', 'false');
    expect(marcusCard).toHaveAttribute('aria-controls', 'scout-story-detail-marcus-johnson');
  });

  it('expands story card on click and updates aria-expanded state', () => {
    render(<Stories />);

    const marcusCard = screen.getByRole('button', { name: /Marcus Johnson, Eagle Scout story/i });
    expect(marcusCard).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(marcusCard);

    expect(marcusCard).toHaveAttribute('aria-expanded', 'true');
    expect(marcusCard).toHaveAttribute('aria-label', expect.stringContaining('Click or press enter to collapse'));
  });

  it('toggles story card on Enter key press', () => {
    render(<Stories />);

    const sarahCard = screen.getByRole('button', { name: /Sarah Martinez, Life Scout story/i });
    expect(sarahCard).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(sarahCard, { key: 'Enter', code: 'Enter' });

    expect(sarahCard).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(sarahCard, { key: 'Enter', code: 'Enter' });

    expect(sarahCard).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles story card on Space key press', () => {
    render(<Stories />);

    const davidCard = screen.getByRole('button', { name: /David Chen, Star Scout story/i });
    expect(davidCard).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(davidCard, { key: ' ', code: 'Space' });

    expect(davidCard).toHaveAttribute('aria-expanded', 'true');
  });
});
