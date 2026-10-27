import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampingGuide from '../CampingGuide';

describe('CampingGuide', () => {
  test('renders heading and external resource link with aria-label', () => {
    render(<CampingGuide />);

    expect(screen.getByText('🏕️ Troop 242 Camping Guide')).toBeInTheDocument();

    const externalLink = screen.getByRole('link', { name: /Scouting.org Camping Resources/i });
    expect(externalLink).toHaveAttribute('href', 'https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/camping/');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(externalLink).toHaveAttribute('aria-label', 'Scouting.org Camping Resources (opens in a new tab)');
  });

  test('handles accordion toggles with correct WAI-ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<CampingGuide />);

    const shelterHeader = screen.getByRole('button', { name: /Shelter & Sleep/i });
    expect(shelterHeader).toHaveAttribute('type', 'button');
    expect(shelterHeader).toHaveAttribute('aria-expanded', 'false');

    // Expand
    await user.click(shelterHeader);

    expect(shelterHeader).toHaveAttribute('aria-expanded', 'true');

    const contentPanel = screen.getByRole('region', { name: /Shelter & Sleep/i });
    expect(contentPanel).toBeInTheDocument();
    expect(screen.getByText('✓ Tent with rainfly and stakes')).toBeInTheDocument();

    // Collapse
    await user.click(shelterHeader);
    expect(shelterHeader).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('✓ Tent with rainfly and stakes')).not.toBeInTheDocument();
  });

  test('back-to-top button has type="button" and aria-label', async () => {
    const user = userEvent.setup();
    window.scrollTo = jest.fn();

    render(<CampingGuide />);

    const backToTopBtn = screen.getByRole('button', { name: 'Scroll back to top of page' });
    expect(backToTopBtn).toHaveAttribute('type', 'button');

    await user.click(backToTopBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
