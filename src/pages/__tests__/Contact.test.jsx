/* eslint-disable no-unused-vars */
/**
 * Unit tests for Contact page accessibility and UX features
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../Contact';

const renderComponent = () => {
  return render(<Contact />);
};

describe('Contact Page Accessibility & UX', () => {
  it('should associate label elements with form fields correctly', () => {
    renderComponent();

    // Verify inputs can be selected via their labels
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('should render FAQ accordion with correct WAI-ARIA properties and handle expansion', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Find the first FAQ accordion button
    const firstFaqButton = screen.getByRole('button', { name: /how much does it cost to join\?/i });
    expect(firstFaqButton).toBeInTheDocument();

    // Check WAI-ARIA attributes
    expect(firstFaqButton).toHaveAttribute('id', 'faq-btn-0');
    expect(firstFaqButton).toHaveAttribute('aria-expanded', 'false');
    expect(firstFaqButton).toHaveAttribute('aria-controls', 'faq-panel-0');

    // Click to expand the accordion item
    await user.click(firstFaqButton);

    // Verify it is now expanded
    expect(firstFaqButton).toHaveAttribute('aria-expanded', 'true');

    // Click again to collapse
    await user.click(firstFaqButton);
    expect(firstFaqButton).toHaveAttribute('aria-expanded', 'false');
  });
});
