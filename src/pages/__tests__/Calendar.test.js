import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Calendar from '../Calendar';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('../../firebase/firebase', () => ({
  db: {},
  auth: {},
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({ exists: () => false }),
  setDoc: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, profile: null }),
}));

jest.mock('../../utils/adminData', () => ({
  getEvents: jest.fn().mockResolvedValue([]),
}));

const renderCalendar = () => {
  return render(
    <MemoryRouter>
      <Calendar />
    </MemoryRouter>
  );
};

describe('Calendar component UX and Accessibility', () => {
  it('renders title and external subscribe link with aria-label', async () => {
    renderCalendar();

    const heading = await screen.findByRole('heading', { name: /Troop 242 Calendar/i });
    expect(heading).toBeInTheDocument();

    const subscribeLink = screen.getByRole('link', { name: /Subscribe to Troop 242 Google Calendar \(opens in a new tab\)/i });
    expect(subscribeLink).toBeInTheDocument();
    expect(subscribeLink).toHaveAttribute('target', '_blank');
  });

  it('implements WAI-ARIA tab pattern for packing list', async () => {
    const user = userEvent.setup();
    renderCalendar();

    await waitFor(() => {
      expect(screen.getByRole('tablist', { name: /Packing list categories/i })).toBeInTheDocument();
    });

    const tablist = screen.getByRole('tablist', { name: /Packing list categories/i });
    expect(tablist).toBeInTheDocument();

    const meetingsTab = screen.getByRole('tab', { name: /meetings/i });
    const campoutsTab = screen.getByRole('tab', { name: /campouts/i });
    const hikesTab = screen.getByRole('tab', { name: /hikes/i });

    expect(meetingsTab).toHaveAttribute('aria-selected', 'true');
    expect(campoutsTab).toHaveAttribute('aria-selected', 'false');
    expect(hikesTab).toHaveAttribute('aria-selected', 'false');

    const activePanel = screen.getByRole('tabpanel');
    expect(activePanel).toHaveAttribute('id', 'packing-panel-meetings');
    expect(activePanel).toHaveAttribute('aria-labelledby', 'packing-tab-meetings');

    expect(screen.getByText(/Uniform \(shirt, neckerchief, slide\)/i)).toBeInTheDocument();

    // Click campouts tab
    await user.click(campoutsTab);

    expect(meetingsTab).toHaveAttribute('aria-selected', 'false');
    expect(campoutsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Tent & sleeping bag/i)).toBeInTheDocument();
  });
});
