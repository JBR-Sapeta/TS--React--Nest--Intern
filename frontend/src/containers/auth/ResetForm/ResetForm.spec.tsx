import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { useResetPassword } from '@Data/query/auth';
import { QUERY_PARAMS, ROUTER_PATHS } from '@Router/constants';

import ResetForm from './ResetForm';

const VALID_FORM_DATA = {
  confirmPassword: 'Password123#',
  password: 'Password123#',
};

const INVALID_FORM_DATA = {
  confirmPassword: 'Password123',
  password: '',
};

const VALID_REQUEST_BODY = {
  password: 'Password123#',
  resetToken: 'abc123',
};

const resetPasswordMutation = vi.fn();

vi.mock('@Data/query/auth', () => ({
  useResetPassword: vi.fn(),
}));

describe('ResetForm', () => {
  beforeEach(() => {
    vi.mocked(useResetPassword).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      resetPasswordMutation,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders h2 with form name - "Odzyskaj konto"', () => {
    render(
      <MemoryRouter>
        <ResetForm />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Odzyskaj konto'
    );
  });

  it('renders password and confirmPassword inputs', () => {
    render(
      <MemoryRouter>
        <ResetForm />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Hasło');
    const confirmPasswordInput = screen.getByLabelText('Powtórz hasło');

    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  it('has a link to the login page', async () => {
    render(
      <MemoryRouter>
        <ResetForm />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', {
      name: /zaloguj się/i,
    });

    expect(loginLink).toBeInTheDocument();
  });

  it('does not call resetPasswordMutation when the form is submitted with empty fields', async () => {
    render(
      <MemoryRouter>
        <ResetForm />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', {
      name: /ustaw hasło/i,
    });

    await user.click(submitButton);

    expect(resetPasswordMutation).toHaveBeenCalledTimes(0);
  });

  it('does not call resetPasswordMutation when the form is submitted and confirm password is not provided', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/${ROUTER_PATHS.RESET}?${QUERY_PARAMS.RESET_TOKEN}=${VALID_REQUEST_BODY.resetToken}`,
        ]}
      >
        <ResetForm />
      </MemoryRouter>
    );

    const { password } = VALID_FORM_DATA;

    const passwordInput = screen.getByLabelText('Hasło');
    const confirmPasswordInput = screen.getByLabelText('Powtórz hasło');

    await user.click(passwordInput);
    await user.keyboard(password);

    await user.click(confirmPasswordInput);

    const submitButton = screen.getByRole('button', {
      name: /ustaw hasło/i,
    });

    await user.click(submitButton);

    expect(resetPasswordMutation).toHaveBeenCalledTimes(0);
  });

  it('does not call resetPasswordMutation when the password does not match confirm password', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/${ROUTER_PATHS.RESET}?${QUERY_PARAMS.RESET_TOKEN}=${VALID_REQUEST_BODY.resetToken}`,
        ]}
      >
        <ResetForm />
      </MemoryRouter>
    );

    const { password } = VALID_FORM_DATA;
    const { confirmPassword } = INVALID_FORM_DATA;

    const passwordInput = screen.getByLabelText('Hasło');
    const confirmPasswordInput = screen.getByLabelText('Powtórz hasło');

    await user.click(passwordInput);
    await user.keyboard(password);

    await user.click(confirmPasswordInput);
    await user.keyboard(confirmPassword);

    const submitButton = screen.getByRole('button', {
      name: /ustaw hasło/i,
    });

    await user.click(submitButton);

    expect(resetPasswordMutation).toHaveBeenCalledTimes(0);
  });

  it('calls resetPasswordMutation when the form is submitted and reset token is not provided in URL', async () => {
    render(
      <MemoryRouter initialEntries={[`/${ROUTER_PATHS.RESET}}`]}>
        <ResetForm />
      </MemoryRouter>
    );

    const { password, confirmPassword } = VALID_FORM_DATA;

    const passwordInput = screen.getByLabelText('Hasło');
    const confirmPasswordInput = screen.getByLabelText('Powtórz hasło');

    await user.click(passwordInput);
    await user.keyboard(password);

    await user.click(confirmPasswordInput);
    await user.keyboard(confirmPassword);

    const submitButton = screen.getByRole('button', {
      name: /ustaw hasło/i,
    });

    await user.click(submitButton);

    expect(resetPasswordMutation).toHaveBeenCalledTimes(0);
  });

  it('calls resetPasswordMutation when the form is submitted with valid values', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/${ROUTER_PATHS.RESET}?${QUERY_PARAMS.RESET_TOKEN}=${VALID_REQUEST_BODY.resetToken}`,
        ]}
      >
        <ResetForm />
      </MemoryRouter>
    );

    const { password, confirmPassword } = VALID_FORM_DATA;

    const passwordInput = screen.getByLabelText('Hasło');
    const confirmPasswordInput = screen.getByLabelText('Powtórz hasło');

    await user.click(passwordInput);
    await user.keyboard(password);

    await user.click(confirmPasswordInput);
    await user.keyboard(confirmPassword);

    const submitButton = screen.getByRole('button', {
      name: /ustaw hasło/i,
    });

    await user.click(submitButton);

    expect(resetPasswordMutation).toHaveBeenCalledWith(VALID_REQUEST_BODY);
  });
});
