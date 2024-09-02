import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MainPhoto, DEFAULT_IMAGE } from './MainPhoto';

const URL = '/logo.png';

describe('MainPhoto', () => {
  it('renders company logo', () => {
    render(<MainPhoto url={URL} />);

    const mainPhoto = screen.getByAltText(/logo firmy/i);

    expect(mainPhoto).toBeInTheDocument();
    expect(mainPhoto).toHaveAttribute('src', URL);
  });

  it('renders default company logo if value of provided url is null', () => {
    render(<MainPhoto url={null} />);

    const mainPhoto = screen.getByAltText(/logo firmy/i);

    expect(mainPhoto).toBeInTheDocument();
    expect(mainPhoto).toHaveAttribute('src', DEFAULT_IMAGE);
  });
});
