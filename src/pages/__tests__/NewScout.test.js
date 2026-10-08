import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewScout from '../NewScout';

// Mock Framer Motion to prevent JSDOM layout animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const {
        initial: _initial,
        animate: _animate,
        whileInView: _whileInView,
        viewport: _viewport,
        transition: _transition,
        variants: _variants,
        whileHover: _whileHover,
        whileTap: _whileTap,
        ...rest
      } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }) => {
      const {
        initial: _initial,
        animate: _animate,
        whileInView: _whileInView,
        viewport: _viewport,
        transition: _transition,
        variants: _variants,
        whileHover: _whileHover,
        whileTap: _whileTap,
        ...rest
      } = props;
      return <button {...rest}>{children}</button>;
    },
  },
}));

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('NewScout Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders hero title and section headings correctly', () => {
    renderWithRouter(<NewScout />);
    expect(screen.getByText('Welcome, New Scout!')).toBeInTheDocument();
    expect(screen.getByText('What is Scouts BSA?')).toBeInTheDocument();
    expect(screen.getByText('Start Learning from Left to Right')).toBeInTheDocument();
    expect(screen.getByText('Your First 30 Days')).toBeInTheDocument();
    expect(screen.getByText('What to Bring')).toBeInTheDocument();
    expect(screen.getByText('How Ranks Work')).toBeInTheDocument();
    expect(screen.getByText('Key Terms to Know')).toBeInTheDocument();
    expect(screen.getByText('Parent FAQ')).toBeInTheDocument();
  });

  it('allows checking off 30-day steps and persists to localStorage', () => {
    renderWithRouter(<NewScout />);
    const firstStepTitle = screen.getByText('Attend your first troop meeting');
    const firstStepCard = firstStepTitle.closest('.glass-card');

    expect(firstStepCard).toBeInTheDocument();
    fireEvent.click(firstStepCard);

    const saved = JSON.parse(localStorage.getItem('newScoutChecklist') || '{}');
    expect(saved['0']).toBe(true);
  });

  it('switches tabs in What to Bring section', () => {
    renderWithRouter(<NewScout />);
    expect(screen.getByText('Packing List: First Meeting')).toBeInTheDocument();

    const campoutTab = screen.getByRole('button', { name: 'Campout' });
    fireEvent.click(campoutTab);

    expect(screen.getByText('Packing List: Campout')).toBeInTheDocument();
    expect(screen.getByText('Sleeping bag')).toBeInTheDocument();
  });

  it('expands FAQ accordion on click', () => {
    renderWithRouter(<NewScout />);
    const faqQuestion = screen.getByText('How much does it cost to join?');
    fireEvent.click(faqQuestion);

    expect(screen.getByText(/BSA national membership fee/i)).toBeInTheDocument();
  });
});
