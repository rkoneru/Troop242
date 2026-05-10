import { render, screen, fireEvent } from '@testing-library/react';
import SkipLink from '../SkipLink';
import '@testing-library/jest-dom';

describe('SkipLink', () => {
  it('should render skip link', () => {
    render(<SkipLink />);
    const link = screen.getByText(/Skip to main content/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('sr-only');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should focus main-content on click', () => {
    document.body.innerHTML = `
      <div id="root">
        <main id="main-content" tabIndex="-1"></main>
      </div>
    `;
    const mainContent = document.getElementById('main-content');
    mainContent.focus = jest.fn();

    render(<SkipLink />);
    const link = screen.getByText(/Skip to main content/i);

    fireEvent.click(link);

    expect(mainContent.focus).toHaveBeenCalled();
  });
});
