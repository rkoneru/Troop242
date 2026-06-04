/**
 * Tests for ErrorBoundary component
 * Tests error catching and fallback UI rendering
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error message');
};

// Safe component
const SafeComponent = () => <div>Safe content</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for these tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('should render fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('should show error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error message/i)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/Test error message/i)).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should provide try again button', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.queryByText(/Try again/i);
    expect(tryAgainButton).not.toBeInTheDocument();

    // Re-render with error
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Try again/i)).toBeInTheDocument();
  });

  it('should provide go home button', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Go home/i)).toBeInTheDocument();
  });

  it('should reset error state on try again click', async () => {
    const user = userEvent.setup();
    let shouldError = true;

    const ConditionalComponent = () => {
      if (shouldError) {
        throw new Error('Temporary error');
      }
      return <div>Success</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    shouldError = false;
    const tryAgainButton = screen.getByText(/Try again/i);
    await user.click(tryAgainButton);

    // Verify error boundary reset
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('should navigate home on go home click', async () => {
    const user = userEvent.setup();
    delete window.location;
    window.location = { href: '' };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const goHomeButton = screen.getByText(/Go home/i);
    await user.click(goHomeButton);

    expect(window.location.href).toBe('/');
  });
});
