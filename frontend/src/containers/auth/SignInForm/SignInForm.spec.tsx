import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { useSignIn } from '@Data/query/auth';

import { AuthForms } from '../enum';
import SignInForm from './SignInForm';

const VALID_FORM_DATA = {
  email: 'johndoe@mail.com',
  password: 'Password123#',
};

const INVALID_FORM_DATA = {
  email: 'johndoemail.com',
  password: '',
};

const changeFormMock = vi.fn();
const signInMutation = vi.fn();

vi.mock('@Data/query/auth', () => ({
  useSignIn: vi.fn(),
}));

describe('SignInForm', () => {
  beforeEach(() => {
    vi.mocked(useSignIn).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      signInMutation,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders h2 with form name - "Logowanie"', () => {
    render(<SignInForm changeForm={changeFormMock} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Logowanie'
    );
  });

  it('renders email and password inputs', () => {
    render(<SignInForm changeForm={changeFormMock} />);

    const emailNameInput = screen.getByRole('textbox', { name: /email/i });
    const passwordinput = screen.getByLabelText('Hasło');

    expect(emailNameInput).toBeInTheDocument();
    expect(passwordinput).toBeInTheDocument();
  });

  it('renders buttons to change the form', () => {
    render(<SignInForm changeForm={changeFormMock} />);

    const signupButton = screen.getByRole('button', {
      name: /zarejestruj się/i,
    });
    const recoveryButton = screen.getByRole('button', {
      name: /odzyskaj konto/i,
    });

    expect(signupButton).toBeInTheDocument();
    expect(recoveryButton).toBeInTheDocument();
  });

  it('calls changeForm functions with proper value when "Zarejestruj się" button is clicked', async () => {
    render(<SignInForm changeForm={changeFormMock} />);

    const signupButton = screen.getByRole('button', {
      name: /zarejestruj się/i,
    });

    await user.click(signupButton);

    expect(changeFormMock).toHaveBeenCalledWith(AuthForms.SIGN_UP);
  });

  it('calls changeForm functions with proper value when "Odzyskaj konto" button is clicked', async () => {
    render(<SignInForm changeForm={changeFormMock} />);

    const recoveryButton = screen.getByRole('button', {
      name: /odzyskaj konto/i,
    });

    await user.click(recoveryButton);

    expect(changeFormMock).toHaveBeenCalledWith(AuthForms.RECOVERY);
  });

  it('does not call signUpMutation when the form is submitted with empty fields', async () => {
    render(<SignInForm changeForm={changeFormMock} />);

    const submitButton = screen.getByRole('button', {
      name: /zaloguj się/i,
    });

    await user.click(submitButton);

    expect(signInMutation).toHaveBeenCalledTimes(0);
  });

  it('does not call signUpMutation when the form is submitted with invalid email', async () => {
    render(<SignInForm changeForm={changeFormMock} />);

    const { password } = VALID_FORM_DATA;
    const { email } = INVALID_FORM_DATA;

    const emailNameInput = screen.getByRole('textbox', { name: /email/i });
    const passwordinput = screen.getByLabelText('Hasło');

    await user.click(emailNameInput);
    await user.keyboard(email);

    await user.click(passwordinput);
    await user.keyboard(password);

    const submitButton = screen.getByRole('button', {
      name: /zaloguj się/i,
    });

    await user.click(submitButton);

    expect(signInMutation).toHaveBeenCalledTimes(0);
  });

  it('calls signUpMutation when the form is submitted with valid values', async () => {
    render(<SignInForm changeForm={changeFormMock} />);

    const { email, password } = VALID_FORM_DATA;

    const emailNameInput = screen.getByRole('textbox', { name: /email/i });
    const passwordinput = screen.getByLabelText('Hasło');

    await user.click(emailNameInput);
    await user.keyboard(email);
    await user.click(passwordinput);
    await user.keyboard(password);

    const submitButton = screen.getByRole('button', {
      name: /zaloguj się/i,
    });

    await user.click(submitButton);

    expect(signInMutation).toHaveBeenCalledWith(VALID_FORM_DATA);
  });
});
