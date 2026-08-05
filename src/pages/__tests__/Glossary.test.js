import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Glossary from '../Glossary';

describe('Glossary', () => {
  it('should render the glossary hero and list terms', () => {
    render(<Glossary />);
    expect(screen.getByText('Scout Glossary')).toBeInTheDocument();
    expect(screen.getByText('Advancement')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search terms...')).toBeInTheDocument();
  });

  it('should filter terms based on search input', async () => {
    const user = userEvent.setup();
    render(<Glossary />);

    const searchInput = screen.getByPlaceholderText('Search terms...');
    await user.type(searchInput, 'Advancement');

    // 'Advancement' should be visible
    expect(screen.getByText('Advancement')).toBeInTheDocument();

    // 'Eagle Scout' should not be visible anymore
    expect(screen.queryByText('Eagle Scout')).not.toBeInTheDocument();
  });
});
