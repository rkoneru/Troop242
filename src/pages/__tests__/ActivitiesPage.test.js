/**
 * Integration tests for ActivitiesPage component
 * Tests activity loading, signup, and RSVP flows with Firestore
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ActivitiesPage from '../ActivitiesPage';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock Firebase functions
const mockDocs = jest.fn();
const mockGetDocs = jest.fn();
const mockUpdateDoc = jest.fn();
const mockArrayUnion = jest.fn(val => val);
const mockArrayRemove = jest.fn(val => val);

jest.mock('firebase/auth', () => {
  const mockAuthObj = { currentUser: null };
  return {
    getAuth: jest.fn(() => mockAuthObj),
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback({ uid: 'scout-uid', email: 'scout@example.com' });
      return jest.fn();
    }),
  };
});

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  getDocs: (...args) => mockGetDocs(...args),
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: (...args) => mockUpdateDoc(...args),
  arrayUnion: (...args) => mockArrayUnion(...args),
  arrayRemove: (...args) => mockArrayRemove(...args),
  Timestamp: {
    now: () => new Date(),
  },
}));

// Mock the adminData utility
jest.mock('../../utils/adminData', () => ({
  getActivities: jest.fn(),
}));

const renderComponent = (component) => {
  return render(
    <BrowserRouter basename="/Troop242/">
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ActivitiesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { getDoc } = require('firebase/firestore');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ name: 'John Scout', role: 'scout' }),
    });
  });

  it('should render activities page header', () => {
    mockGetDocs.mockResolvedValue({
      docs: [],
    });

    renderComponent(<ActivitiesPage />);

    expect(screen.getByText(/activities/i)).toBeInTheDocument();
  });

  it('should load and display activities from Firestore', async () => {
    const mockActivities = [
      {
        id: 'activity-1',
        data: () => ({
          title: 'Camping Trip',
          type: 'activity',
          date: new Date('2026-04-15'),
          location: 'Camp Forested',
          description: 'Spring camping adventure',
          spots: 25,
          signedUp: [],
        }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Camping Trip')).toBeInTheDocument();
    });
  });

  it('should display activity details correctly', async () => {
    const mockActivities = [
      {
        id: 'activity-1',
        data: () => ({
          title: 'Hiking Day',
          type: 'activity',
          date: new Date('2026-04-20'),
          location: 'Pine Trail',
          description: 'Morning hike with the troop',
          spots: 15,
          signedUp: [],
        }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Hiking Day')).toBeInTheDocument();
      expect(screen.getByText('Pine Trail')).toBeInTheDocument();
    });
  });

  it('should show available spots correctly', async () => {
    const mockActivities = [
      {
        id: 'activity-1',
        data: () => ({
          title: 'Camping',
          type: 'activity',
          date: new Date('2026-04-15'),
          location: 'Camp',
          description: 'Camping trip',
          spots: 25,
          signedUp: [{ uid: 'scout-1' }, { uid: 'scout-2' }],
        }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      // Should show remaining spots: 25 - 2 = 23
      expect(screen.getByText(/23.*remaining/i)).toBeInTheDocument();
    });
  });

  it('should allow scout to sign up for activity', async () => {
    const user = userEvent.setup();
    const mockActivities = [
      {
        id: 'activity-1',
        data: () => ({
          title: 'Camping Trip',
          type: 'activity',
          date: new Date('2026-04-15'),
          location: 'Camp',
          description: 'Spring camping',
          spots: 25,
          signedUp: [],
        }),
        ref: 'activity-ref-1',
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    mockUpdateDoc.mockResolvedValue(undefined);

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Camping Trip')).toBeInTheDocument();
    });

    const signUpButton = screen.getByText(/sign up/i);
    await user.click(signUpButton);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('should show signed up status when scout is already signed up', async () => {
    const mockActivities = [
      {
        id: 'activity-1',
        data: () => ({
          title: 'Camping Trip',
          type: 'activity',
          date: new Date('2026-04-15'),
          location: 'Camp',
          description: 'Spring camping',
          spots: 25,
          signedUp: [{ uid: 'scout-uid', name: 'John Scout' }],
        }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/✓ Signed up/i)).toBeInTheDocument();
    });
  });

  it('should disable signup when activity is full', async () => {
    const mockActivities = [
      {
        id: 'activity-1',
        data: () => ({
          title: 'Limited Activity',
          type: 'activity',
          date: new Date('2026-04-15'),
          location: 'Camp',
          description: 'Limited spots',
          spots: 2,
          signedUp: [
            { uid: 'scout-1' },
            { uid: 'scout-2' },
          ],
        }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      const signUpButton = screen.queryByText(/sign up/i);
      expect(signUpButton).not.toBeInTheDocument();
      expect(screen.getByText(/full/i)).toBeInTheDocument();
    });
  });

  it('should separate activities and events', async () => {
    const mockActivities = [
      {
        id: 'activity-1',
        data: () => ({
          title: 'Camping',
          type: 'activity',
          date: new Date('2026-04-15'),
          location: 'Camp',
          description: 'Camping trip',
          spots: 25,
          signedUp: [],
        }),
      },
      {
        id: 'event-1',
        data: () => ({
          title: 'General Meeting',
          type: 'event',
          date: new Date('2026-04-20'),
          location: 'Scout Hall',
          description: 'Monthly meeting',
          spots: 9999,
          signedUp: [],
        }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Camping')).toBeInTheDocument();
      expect(screen.getByText('General Meeting')).toBeInTheDocument();
      // Should have separate section headers
      expect(screen.getByText(/activities/i)).toBeInTheDocument();
    });
  });

  it('should handle events as RSVP (interested)', async () => {
    const user = userEvent.setup();
    const mockActivities = [
      {
        id: 'event-1',
        data: () => ({
          title: 'Meeting',
          type: 'event',
          date: new Date('2026-04-20'),
          location: 'Scout Hall',
          description: 'Monthly meeting',
          spots: 9999,
          signedUp: [],
        }),
        ref: 'event-ref-1',
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockActivities,
    });

    mockUpdateDoc.mockResolvedValue(undefined);

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Meeting')).toBeInTheDocument();
    });

    const rsvpButton = screen.getByRole('button', { name: /interested|rsvp/i });
    await user.click(rsvpButton);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('should handle Firestore errors gracefully', async () => {
    mockGetDocs.mockRejectedValue(new Error('Firestore error'));

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should show empty state when no activities', async () => {
    mockGetDocs.mockResolvedValue({
      docs: [],
    });

    renderComponent(<ActivitiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/no.*activities/i)).toBeInTheDocument();
    });
  });
});
