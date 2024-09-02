import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { VerifiedLabel } from './VerifiedLabel';

const VERIFIED_TEXT = 'Zweryfikowany';
const NOT_VERIFIED_TEXT = 'Nie zweryfikowany';

describe('VerifiedLabel', () => {
  it('renders "Zweryfikowany" text when "isVerified" property is set to true', () => {
    render(<VerifiedLabel isVerified />);

    const label = screen.getByText(new RegExp(VERIFIED_TEXT, 'i'));

    expect(label).toBeInTheDocument();
  });

  it('renders "Nie zweryfikowany" text when "isVerified" property is set to false', () => {
    render(<VerifiedLabel isVerified={false} />);

    const label = screen.getByText(new RegExp(NOT_VERIFIED_TEXT, 'i'));

    expect(label).toBeInTheDocument();
  });
});
