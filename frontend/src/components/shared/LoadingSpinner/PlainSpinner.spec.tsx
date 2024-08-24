import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import PlainSpinner from './PlainSpinner';

describe('LogoSpinner', () => {
  it(`renders loading text`, () => {
    render(<PlainSpinner size="small" />);

    const loadingText = screen.getByText('ładowanie...');

    expect(loadingText).toBeInTheDocument();
  });
});
