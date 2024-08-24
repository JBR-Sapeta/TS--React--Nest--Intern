import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Hr from './Hr';

describe('HR', () => {
  it(`renders horizontal line`, () => {
    render(<Hr />);

    const hrElement = screen.getByRole('separator');

    expect(hrElement).toBeInTheDocument();
  });
});
