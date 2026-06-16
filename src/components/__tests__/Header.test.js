import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';
import { AuthProvider } from '../../contexts/AuthContext';
import '@testing-library/jest-dom';

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false
  })
}));

describe('Header Accessibility', () => {
  const renderHeader = () => {
    return render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  test('should have a skip to main content link', () => {
    renderHeader();
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveClass('skip-link');
  });

  test('dropdown buttons should have ARIA attributes', () => {
    renderHeader();
    const guideBtn = screen.getByRole('button', { name: /guide/i });
    const resourcesBtn = screen.getByRole('button', { name: /resources/i });

    expect(guideBtn).toHaveAttribute('aria-haspopup', 'true');
    expect(guideBtn).toHaveAttribute('aria-expanded', 'false');

    expect(resourcesBtn).toHaveAttribute('aria-haspopup', 'true');
    expect(resourcesBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('dropdown buttons should toggle aria-expanded on click', () => {
    renderHeader();
    const guideBtn = screen.getByRole('button', { name: /guide/i });

    fireEvent.click(guideBtn);
    expect(guideBtn).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(guideBtn);
    expect(guideBtn).toHaveAttribute('aria-expanded', 'false');
  });
});
