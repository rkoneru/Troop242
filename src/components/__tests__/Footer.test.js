import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('renders external links with target="_blank", rel="noopener noreferrer", and aria-label indicating open in new tab', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const scoutingLink = screen.getByRole('link', { name: /Scouting America/i });
    expect(scoutingLink).toHaveAttribute('href', 'https://www.scouting.org');
    expect(scoutingLink).toHaveAttribute('target', '_blank');
    expect(scoutingLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(scoutingLink).toHaveAttribute('aria-label', 'Scouting America (opens in a new tab)');

    const scoutbookLink = screen.getByRole('link', { name: /Scoutbook/i });
    expect(scoutbookLink).toHaveAttribute('href', 'https://scoutbook.scouting.org/');
    expect(scoutbookLink).toHaveAttribute('target', '_blank');
    expect(scoutbookLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(scoutbookLink).toHaveAttribute('aria-label', 'Scoutbook (opens in a new tab)');

    const mapLink = screen.getByRole('link', { name: /Sanford, FL location on Google Maps/i });
    expect(mapLink).toHaveAttribute('target', '_blank');
    expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(mapLink).toHaveAttribute('aria-label', 'Sanford, FL location on Google Maps (opens in a new tab)');
  });
});
