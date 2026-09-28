import { render, screen } from '@testing-library/react';
import CampingAnimation from '../camping-animation';

describe('CampingAnimation', () => {
  it('renders the camping animation component without crashing', () => {
    render(<CampingAnimation />);
    expect(screen.getByText('CAMPING')).toBeInTheDocument();
    expect(screen.getByText('TENT')).toBeInTheDocument();
    expect(screen.getByText('Troop 242 Camping')).toBeInTheDocument();
  });
});
