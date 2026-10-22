import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../Contact';

beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  window.scrollTo = jest.fn();

  delete window.location;
  window.location = { href: '' };
});

describe('Contact Page', () => {
  it('renders form controls associated with labels', () => {
    render(<Contact />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('toggles FAQ accordion items with proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const firstFaqButton = screen.getByRole('button', { name: /how much does it cost to join\?/i });
    expect(firstFaqButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(firstFaqButton);
    expect(firstFaqButton).toHaveAttribute('aria-expanded', 'true');

    await user.click(firstFaqButton);
    expect(firstFaqButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles form submission feedback', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Contact />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });

    await user.type(nameInput, 'Alex Scout');
    await user.type(emailInput, 'alex@example.com');
    await user.type(subjectInput, 'Joining Question');
    await user.type(messageInput, 'How do I sign up?');

    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /message sent!/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/thank you! your email client is opening/i);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    jest.useRealTimers();
  });
});
