import { render, screen } from '@testing-library/react';
import GamesLanding from '../GamesLanding';

describe('GamesLanding Component', () => {
  it('renders game cards with accessible ARIA labels', () => {
    render(<GamesLanding />);

    const kimsGameCard = screen.getByRole('link', {
      name: /Play Kim's Game: Study a tray of Scout items/i
    });
    expect(kimsGameCard).toBeInTheDocument();
    expect(kimsGameCard).toHaveAttribute('href', '/Troop242/Games/kims-game.html');
  });

  it('renders infinity replay stat with accessible label', () => {
    render(<GamesLanding />);

    const infinityStat = screen.getByLabelText('Unlimited');
    expect(infinityStat).toBeInTheDocument();
  });
});
