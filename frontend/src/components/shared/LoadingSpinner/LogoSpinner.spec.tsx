import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import LogoSpinner from './LogoSpinner';

describe('LogoSpinner', () => {
  it(`renders spinner with svg logo`, () => {
    render(<LogoSpinner size="small" />);

    const logoSvg = screen.getByLabelText('Ładowanie');

    expect(logoSvg).toBeInTheDocument();
    expect(logoSvg.tagName).toBe('svg');
  });

  it(`renders loading text`, () => {
    render(<LogoSpinner size="small" />);

    const loadingText = screen.getByText('ładowanie...');

    expect(loadingText).toBeInTheDocument();
  });
});
