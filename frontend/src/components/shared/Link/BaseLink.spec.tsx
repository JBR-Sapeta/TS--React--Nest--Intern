import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BaseLink from './BaseLink';

const LINK_LABEL = 'Link Label';

describe('BaseLink', () => {
  it(`renders link with provided url path `, () => {
    render(
      <MemoryRouter>
        <BaseLink size="small" color="green" path="/" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it(`renders link with the '${LINK_LABEL}' text when it is provided as a child`, () => {
    render(
      <MemoryRouter>
        <BaseLink size="small" color="green" path="/">
          {LINK_LABEL}
        </BaseLink>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveTextContent(LINK_LABEL);
  });
});
