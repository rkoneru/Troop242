import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Appearance from '../Appearance';

// Mock framer-motion to simplify DOM inspection in test environment
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, whileInView, initial, animate, transition, viewport, variants, ...props }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, whileHover, whileTap, whileInView, initial, animate, transition, viewport, variants, ...props }) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe('Appearance Page UX and Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders theme and framework options inside radiogroups with accessible radio buttons', () => {
    render(<Appearance />);

    const generalRadiogroup = screen.getByRole('radiogroup', { name: /general color themes/i });
    expect(generalRadiogroup).toBeInTheDocument();

    const scoutRadiogroup = screen.getByRole('radiogroup', { name: /scout color themes/i });
    expect(scoutRadiogroup).toBeInTheDocument();

    const frameworkRadiogroup = screen.getByRole('radiogroup', { name: /ui frameworks/i });
    expect(frameworkRadiogroup).toBeInTheDocument();

    const currentThemeBtn = screen.getByRole('radio', { name: /current \(dark\) theme/i });
    expect(currentThemeBtn).toBeInTheDocument();
    expect(currentThemeBtn).toHaveAttribute('type', 'button');
    expect(currentThemeBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('updates theme selection, saves preference to localStorage, and announces status on click', () => {
    render(<Appearance />);

    const lightThemeBtn = screen.getByRole('radio', { name: /light theme/i });
    expect(lightThemeBtn).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(lightThemeBtn);

    expect(lightThemeBtn).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem('troopTheme')).toBe('white');

    const statusLiveRegion = screen.getByRole('status');
    expect(statusLiveRegion).toHaveTextContent(/theme set to light/i);
  });

  it('updates UI framework selection and announces status when a framework card is activated', () => {
    render(<Appearance />);

    const minimalBtn = screen.getByRole('radio', { name: /minimalism framework/i });
    expect(minimalBtn).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(minimalBtn);

    expect(minimalBtn).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem('troopFramework')).toBe('minimal');

    const statusLiveRegion = screen.getByRole('status');
    expect(statusLiveRegion).toHaveTextContent(/ui framework set to minimalism/i);
  });
});
