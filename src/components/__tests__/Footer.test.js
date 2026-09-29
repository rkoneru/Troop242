import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

const renderFooter = () => {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe('Footer Component', () => {
  it('renders branding and copyright information', () => {
    renderFooter();
    expect(screen.getAllByText(/Troop 242/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Building today's youth into tomorrow's leaders/i)).toBeInTheDocument();
    expect(screen.getByText(/Troop 242 Sanford. Scouting America/i)).toBeInTheDocument();
  });

  it('renders external links with target="_blank" and explicit aria-labels', () => {
    renderFooter();

    const scoutingAmerica = screen.getByRole('link', { name: /Scouting America \(opens in a new tab\)/i });
    expect(scoutingAmerica).toHaveAttribute('href', 'https://www.scouting.org');
    expect(scoutingAmerica).toHaveAttribute('target', '_blank');
    expect(scoutingAmerica).toHaveAttribute('rel', 'noopener noreferrer');

    const scoutbook = screen.getByRole('link', { name: /Scoutbook \(opens in a new tab\)/i });
    expect(scoutbook).toHaveAttribute('href', 'https://scoutbook.scouting.org/');
    expect(scoutbook).toHaveAttribute('target', '_blank');
    expect(scoutbook).toHaveAttribute('rel', 'noopener noreferrer');

    const mapLink = screen.getByRole('link', { name: /Location: Sanford, FL \(opens Google Maps in a new tab\)/i });
    expect(mapLink).toHaveAttribute('target', '_blank');
    expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders contact section with accessible aria-hidden icons', () => {
    const { container } = renderFooter();
    const mailLink = screen.getByRole('link', { name: /troop242sanford@gmail.com/i });
    expect(mailLink).toHaveAttribute('href', 'mailto:troop242sanford@gmail.com');

    const ariaHiddenIcons = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(ariaHiddenIcons.length).toBeGreaterThanOrEqual(3);
  });
});
