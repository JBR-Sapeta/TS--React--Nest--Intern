import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { useAccountRecovery } from '@Data/query/auth';

import { AuthForms } from '../enum';
import RecoveryForm from './RecoveryForm';

const VALID_FORM_DATA = {
  email: 'johndoe@mail.com',
};

const INVALID_FORM_DATA = {
  email: 'johndoemail.com',
};

const changeFormMock = vi.fn();
const accountRecoveryMutation = vi.fn();

vi.mock('@Data/query/auth', () => ({
  useAccountRecovery: vi.fn(),
}));

describe('RecoveryForm', () => {
  beforeEach(() => {
    vi.mocked(useAccountRecovery).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      accountRecoveryMutation,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders h2 with form name - "Odzyskaj konto"', () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Odzyskaj konto'
    );
  });

  it('renders email and password inputs', () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    const emailNameInput = screen.getByRole('textbox', { name: /email/i });

    expect(emailNameInput).toBeInTheDocument();
  });

  it('renders buttons to change the form', () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    const signupButton = screen.getByRole('button', {
      name: /zarejestruj się/i,
    });
    const loginButton = screen.getByRole('button', { name: /zaloguj się/i });

    expect(signupButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('calls changeForm functions with proper value when "Zarejestruj się" button is clicked', async () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    const signupButton = screen.getByRole('button', {
      name: /zarejestruj się/i,
    });

    await user.click(signupButton);

    expect(changeFormMock).toHaveBeenCalledWith(AuthForms.SIGN_UP);
  });

  it('calls changeForm functions with proper value when "Zaloguj się" button is clicked', async () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    const loginButton = screen.getByRole('button', { name: /zaloguj się/i });

    await user.click(loginButton);

    expect(changeFormMock).toHaveBeenCalledWith(AuthForms.SIGN_IN);
  });

  it('does not call signUpMutation when the form is submitted with empty fields', async () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    const submitButton = screen.getByRole('button', {
      name: /zresetuj hasło/i,
    });

    await user.click(submitButton);

    expect(accountRecoveryMutation).toHaveBeenCalledTimes(0);
  });

  it('does not call signUpMutation when the form is submitted with invalid email', async () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    const { email } = INVALID_FORM_DATA;

    const emailNameInput = screen.getByRole('textbox', { name: /email/i });

    await user.click(emailNameInput);
    await user.keyboard(email);

    const submitButton = screen.getByRole('button', {
      name: /zresetuj hasło/i,
    });

    await user.click(submitButton);

    expect(accountRecoveryMutation).toHaveBeenCalledTimes(0);
  });

  it('calls signUpMutation when the form is submitted with valid values', async () => {
    render(<RecoveryForm changeForm={changeFormMock} />);

    const { email } = VALID_FORM_DATA;

    const emailNameInput = screen.getByRole('textbox', { name: /email/i });

    await user.click(emailNameInput);
    await user.keyboard(email);

    const submitButton = screen.getByRole('button', {
      name: /zresetuj hasło/i,
    });

    await user.click(submitButton);

    expect(accountRecoveryMutation).toHaveBeenCalledWith(VALID_FORM_DATA);
  });
});
