import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Glossary from '../Glossary';

// Mock framer-motion to render children directly without animation overhead in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
}));

describe('Glossary Component', () => {
  it('renders search input with accessibility attributes', () => {
    render(<Glossary />);
    const searchInput = screen.getByRole('textbox', { name: /search glossary terms/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('id', 'glossary-search');
  });

  it('filters glossary terms based on search query', async () => {
    const user = userEvent.setup();
    render(<Glossary />);

    const searchInput = screen.getByRole('textbox', { name: /search glossary terms/i });
    await user.type(searchInput, 'Eagle');

    expect(screen.getByText('Eagle Project')).toBeInTheDocument();
    expect(screen.getByText('Eagle Scout')).toBeInTheDocument();
    expect(screen.queryByText('First Aid')).not.toBeInTheDocument();
  });

  it('shows clear search button and clears input on click', async () => {
    const user = userEvent.setup();
    render(<Glossary />);

    const searchInput = screen.getByRole('textbox', { name: /search glossary terms/i });
    await user.type(searchInput, 'Campout');

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  it('displays empty state with aria-live status when no matching terms found', async () => {
    const user = userEvent.setup();
    render(<Glossary />);

    const searchInput = screen.getByRole('textbox', { name: /search glossary terms/i });
    await user.type(searchInput, 'xyznonexistentterm');

    const emptyMsg = screen.getByText(/no terms found for/i);
    expect(emptyMsg).toBeInTheDocument();
    expect(emptyMsg).toHaveAttribute('role', 'status');
    expect(emptyMsg).toHaveAttribute('aria-live', 'polite');
  });
});
