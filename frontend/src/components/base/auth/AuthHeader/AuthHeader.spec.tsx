import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import AuthHeader from './AuthHeader';

const PROPS = {
  header: 'Nagłówek',
  subHeader: 'string',
};

describe('AuthHeader', () => {
  it('renders h2 with provided header value', () => {
    render(<AuthHeader {...PROPS} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      PROPS.header
    );
  });

  it('renders text provided as subHeader', () => {
    render(<AuthHeader {...PROPS} />);

    expect(screen.getByText(PROPS.subHeader)).toBeInTheDocument();
  });
});
