import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { AddBranchLink } from './AddBranchLink';

describe('AddBranchLink', () => {
  it('renders  link', () => {
    render(
      <MemoryRouter>
        <AddBranchLink />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
  });
});
