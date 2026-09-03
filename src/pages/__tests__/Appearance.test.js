/* eslint-disable no-unused-vars */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Appearance from '../Appearance';

describe('Appearance Page Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders theme cards with accessible button roles and attributes', () => {
    render(<Appearance />);

    const darkThemeBtn = screen.getByRole('button', { name: /Select Current \(Dark\) theme/i });
    expect(darkThemeBtn).toBeInTheDocument();
    expect(darkThemeBtn).toHaveAttribute('tabindex', '0');
    expect(darkThemeBtn).toHaveAttribute('aria-pressed', 'true');

    const greenThemeBtn = screen.getByRole('button', { name: /Select Scout Green theme/i });
    expect(greenThemeBtn).toBeInTheDocument();
    expect(greenThemeBtn).toHaveAttribute('tabindex', '0');
    expect(greenThemeBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('allows theme selection via click', async () => {
    render(<Appearance />);

    const whiteThemeBtn = screen.getByRole('button', { name: /Select Light theme/i });
    expect(whiteThemeBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(whiteThemeBtn);

    await waitFor(() => {
      expect(whiteThemeBtn).toHaveAttribute('aria-pressed', 'true');
    });
    expect(localStorage.getItem('troopTheme')).toBe('white');
  });

  it('allows theme selection via keyboard Enter key', async () => {
    render(<Appearance />);

    const greenThemeBtn = screen.getByRole('button', { name: /Select Scout Green theme/i });
    expect(greenThemeBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.keyDown(greenThemeBtn, { key: 'Enter' });

    await waitFor(() => {
      expect(greenThemeBtn).toHaveAttribute('aria-pressed', 'true');
    });
    expect(localStorage.getItem('troopTheme')).toBe('green');
  });

  it('allows framework selection via keyboard Space key', async () => {
    render(<Appearance />);

    const minimalFrameworkBtn = screen.getByRole('button', { name: /Select Minimalism framework/i });
    expect(minimalFrameworkBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.keyDown(minimalFrameworkBtn, { key: ' ' });

    await waitFor(() => {
      expect(minimalFrameworkBtn).toHaveAttribute('aria-pressed', 'true');
    });
    expect(localStorage.getItem('troopFramework')).toBe('minimal');
  });
});
