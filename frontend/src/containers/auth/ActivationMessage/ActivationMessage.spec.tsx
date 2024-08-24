/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useAccountActivation } from '@Data/query/auth';
import { QUERY_PARAMS, ROUTER_PATHS } from '@Router/constants';

import ActivationMessage from './ActivationMessage';

const VALID_REQUEST_BODY = {
  token: 'abc123',
};

const accountActivationMutation = vi.fn();

vi.mock('@Data/query/auth', () => ({
  useAccountActivation: vi.fn(),
}));

describe('ActivationMessage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders h2 with text - "Aktywacja konta"', () => {
    vi.mocked(useAccountActivation).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      accountActivationMutation,
    });

    render(
      <MemoryRouter>
        <ActivationMessage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Aktywacja konta'
    );
  });

  it('renders activation logo', () => {
    vi.mocked(useAccountActivation).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      accountActivationMutation,
    });

    render(
      <MemoryRouter>
        <ActivationMessage />
      </MemoryRouter>
    );

    const logoSvg = screen.getByLabelText('Ikona - Aktywowane');

    expect(logoSvg).toBeInTheDocument();
    expect(logoSvg.tagName).toBe('svg');
  });

  it('renders plain loading spiner when reequest is on going', () => {
    vi.mocked(useAccountActivation).mockReturnValue({
      isPending: true,
      data: undefined,
      error: null,
      accountActivationMutation,
    });

    render(
      <MemoryRouter
        initialEntries={[
          `/${ROUTER_PATHS.ACTIVATION}?${QUERY_PARAMS.ACTIVATION_TOKEN}=${VALID_REQUEST_BODY.token}`,
        ]}
      >
        <ActivationMessage />
      </MemoryRouter>
    );

    const logoSvg = screen.getByText('ładowanie...');

    expect(logoSvg).toBeInTheDocument();
    expect(logoSvg.tagName).toBe('P');
  });

  it('renders a link to the login page and success message when the request is successful', () => {
    vi.mocked(useAccountActivation).mockReturnValue({
      isPending: false,
      data: {
        message: 'Pomyślnie aktywowano konto',
        statusCode: 200,
        error: null,
      },
      error: null,
      accountActivationMutation,
    });

    render(
      <MemoryRouter
        initialEntries={[
          `/${ROUTER_PATHS.ACTIVATION}?${QUERY_PARAMS.ACTIVATION_TOKEN}=${VALID_REQUEST_BODY.token}`,
        ]}
      >
        <ActivationMessage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('link', { name: /zaloguj się/i });
    const message = screen.getByText('Pomyślnie aktywowano konto');

    expect(loginButton).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it('renders a link to the login page and error message when the request fails', () => {
    vi.mocked(useAccountActivation).mockReturnValue({
      isPending: false,
      data: undefined,
      error: {
        // @ts-ignore
        response: {
          data: {
            message: 'Nieprawidłowy token.',
            statusCode: 200,
            error: 'Bad Request',
          },
        },
      },
      accountActivationMutation,
    });

    render(
      <MemoryRouter
        initialEntries={[
          `/${ROUTER_PATHS.ACTIVATION}?${QUERY_PARAMS.ACTIVATION_TOKEN}=${VALID_REQUEST_BODY.token}`,
        ]}
      >
        <ActivationMessage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('link', { name: /zaloguj się/i });
    const message = screen.getByText('Nieprawidłowy token.');

    expect(loginButton).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});
