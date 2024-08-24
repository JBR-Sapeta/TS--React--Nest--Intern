import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';

import App from './App';

vi.spyOn(global, 'scrollTo').mockImplementation(() => {});

describe('App', () => {
  beforeAll(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders h1 with "Praktyka" text', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Praktyka'
    );
  });
});
