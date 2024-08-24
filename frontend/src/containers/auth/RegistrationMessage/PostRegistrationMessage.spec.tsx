import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import PostRegistrationMessage from './PostRegistrationMessage';

describe('PostRegistrationMessage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders h2 with text - "Aktywuj swoje konto"', () => {
    render(
      <MemoryRouter>
        <PostRegistrationMessage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Aktywuj swoje konto'
    );
  });

  it('renders activation logo', () => {
    render(
      <MemoryRouter>
        <PostRegistrationMessage />
      </MemoryRouter>
    );

    const logoSvg = screen.getByLabelText('Ikona - Zablokowane');

    expect(logoSvg).toBeInTheDocument();
    expect(logoSvg.tagName).toBe('svg');
  });

  it('renders a link to the login page', () => {
    render(
      <MemoryRouter>
        <PostRegistrationMessage />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /zaloguj się/i });

    expect(loginLink).toBeInTheDocument();
  });
});
