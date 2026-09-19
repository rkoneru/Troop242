/**
 * Tests for Stories component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Stories from '../Stories';

// Mock framer-motion for unit testing in jsdom
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      // Filter out framer motion props to avoid DOM warnings
      const {
        initial: _initial,
        animate: _animate,
        transition: _transition,
        whileInView: _whileInView,
        viewport: _viewport,
        whileHover: _whileHover,
        whileTap: _whileTap,
        variants: _variants,
        ...domProps
      } = props;
      return <div {...domProps}>{children}</div>;
    },
  },
}));

describe('Stories', () => {
  it('should render page title and scout stories', () => {
    render(<Stories />);

    expect(screen.getByText(/Scout Stories & Feedback/i)).toBeInTheDocument();
    expect(screen.getByText('Marcus Johnson')).toBeInTheDocument();
    expect(screen.getByText('Sarah Martinez')).toBeInTheDocument();
  });

  it('should toggle story expand state on click', async () => {
    const user = userEvent.setup();
    render(<Stories />);

    // Initially "Click to read full story" text is present
    const readFullStoryPrompts = screen.getAllByText(/Click to read full story/i);
    expect(readFullStoryPrompts.length).toBeGreaterThan(0);

    // Click on Marcus Johnson card
    const marcusCard = screen.getByText('Marcus Johnson').closest('.glass-card');
    await user.click(marcusCard);

    // After click, full story paragraph is displayed
    expect(
      screen.getByText(/Troop 242 has been the most transformative experience/i)
    ).toBeInTheDocument();
  });

  it('should render advantages stats items', () => {
    render(<Stories />);

    expect(screen.getByText('Why Scouts Choose Troop 242')).toBeInTheDocument();
    expect(screen.getByText('Mentorship')).toBeInTheDocument();
    expect(screen.getByText('Adventures')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Achievement')).toBeInTheDocument();
  });
});
