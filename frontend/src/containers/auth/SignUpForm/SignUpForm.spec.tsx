import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { useSignUp } from '@Data/query/auth';

import { AuthForms } from '../enum';
import SignUpForm from './SignUpForm';

const VALID_FORM_DATA = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@mail.com',
  password: 'Password123#',
};

const INVALID_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: 'johndoemail.com',
  password: '',
};

const changeFormMock = vi.fn();
const signUpMutation = vi.fn();

vi.mock('@Data/query/auth', () => ({
  useSignUp: vi.fn(),
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.mocked(useSignUp).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      signUpMutation,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders h2 with form name - "Rejestracja"', () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Rejestracja'
    );
  });

  it('renders first name, last name, email and password inputs', () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    const firstNameInput = screen.getByRole('textbox', { name: /imię/i });
    const lastNameInput = screen.getByRole('textbox', { name: /nazwisko/i });
    const emailNameInput = screen.getByRole('textbox', { name: /email/i });
    const passwordinput = screen.getByLabelText('Hasło');

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailNameInput).toBeInTheDocument();
    expect(passwordinput).toBeInTheDocument();
  });

  it('renders buttons to change the form', () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    const loginButton = screen.getByRole('button', { name: /zaloguj się/i });
    const recoveryButton = screen.getByRole('button', {
      name: /odzyskaj konto/i,
    });

    expect(loginButton).toBeInTheDocument();
    expect(recoveryButton).toBeInTheDocument();
  });

  it('calls changeForm functions with proper value when "Zaloguj się" button is clicked', async () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    const loginButton = screen.getByRole('button', { name: /zaloguj się/i });

    await user.click(loginButton);

    expect(changeFormMock).toHaveBeenCalledWith(AuthForms.SIGN_IN);
  });

  it('calls changeForm functions with proper value when "Odzyskaj konto" button is clicked', async () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    const recoveryButton = screen.getByRole('button', {
      name: /odzyskaj konto/i,
    });

    await user.click(recoveryButton);

    expect(changeFormMock).toHaveBeenCalledWith(AuthForms.RECOVERY);
  });

  it('does not call signUpMutation when the form is submitted with empty fields', async () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    const submitButton = screen.getByRole('button', {
      name: /zarejestruj się/i,
    });

    await user.click(submitButton);

    expect(signUpMutation).toHaveBeenCalledTimes(0);
  });

  it('does not call signUpMutation when the form is submitted with invalid email', async () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    const { firstName, lastName, password } = VALID_FORM_DATA;
    const { email } = INVALID_FORM_DATA;

    const firstNameInput = screen.getByRole('textbox', { name: /imię/i });
    const lastNameInput = screen.getByRole('textbox', { name: /nazwisko/i });
    const emailNameInput = screen.getByRole('textbox', { name: /email/i });
    const passwordinput = screen.getByLabelText('Hasło');

    await user.click(firstNameInput);
    await user.keyboard(firstName);

    await user.click(lastNameInput);
    await user.keyboard(lastName);

    await user.click(emailNameInput);
    await user.keyboard(email);

    await user.click(passwordinput);
    await user.keyboard(password);

    const submitButton = screen.getByRole('button', {
      name: /zarejestruj się/i,
    });

    await user.click(submitButton);

    expect(signUpMutation).toHaveBeenCalledTimes(0);
  });

  it('calls signUpMutation when the form is submitted with valid values', async () => {
    render(<SignUpForm changeForm={changeFormMock} />);

    const { firstName, lastName, email, password } = VALID_FORM_DATA;

    const firstNameInput = screen.getByRole('textbox', { name: /imię/i });
    const lastNameInput = screen.getByRole('textbox', { name: /nazwisko/i });
    const emailNameInput = screen.getByRole('textbox', { name: /email/i });
    const passwordinput = screen.getByLabelText('Hasło');

    await user.click(firstNameInput);
    await user.keyboard(firstName);
    await user.click(lastNameInput);
    await user.keyboard(lastName);
    await user.click(emailNameInput);
    await user.keyboard(email);
    await user.click(passwordinput);
    await user.keyboard(password);

    const submitButton = screen.getByRole('button', {
      name: /zarejestruj się/i,
    });

    await user.click(submitButton);

    expect(signUpMutation).toHaveBeenCalledWith(VALID_FORM_DATA);
  });
});
