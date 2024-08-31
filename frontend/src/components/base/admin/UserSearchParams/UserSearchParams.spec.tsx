import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { UserSearchParams } from './UserSearchParams';

const INITIAL_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  hasBan: false,
};

const changeFirstName = vi.fn();
const changeLastName = vi.fn();
const changeEmail = vi.fn();
const changeHasBan = vi.fn();
const changeSearchParams = vi.fn();
const setParams = vi.fn();

const props = {
  changeFirstName,
  changeLastName,
  changeEmail,
  changeHasBan,
  changeSearchParams,
  setParams,
  values: INITIAL_VALUES,
};

describe('AdminCompanySearchParams', () => {
  it('renders h2 with form name - "Szukaj użytkownika"', () => {
    render(<UserSearchParams {...props} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Szukaj użytkownika'
    );
  });

  it('renders four inputs', () => {
    render(<UserSearchParams {...props} />);

    const firstNameInput = screen.getByRole('textbox', { name: /imię/i });
    const lastNameInput = screen.getByRole('textbox', { name: /nazwisko/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const hasBanInput = screen.getByRole('checkbox', { name: /zablokowany/i });

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(hasBanInput).toBeInTheDocument();
  });

  it('calls input functions whenever the user enters a new value', async () => {
    render(<UserSearchParams {...props} />);

    const firstNameInput = screen.getByRole('textbox', { name: /imię/i });
    const lastNameInput = screen.getByRole('textbox', { name: /nazwisko/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const hasBanInput = screen.getByRole('checkbox', { name: /zablokowany/i });

    await user.click(firstNameInput);
    await user.keyboard('A');

    await user.click(lastNameInput);
    await user.keyboard('A');

    await user.click(emailInput);
    await user.keyboard('A');

    await user.click(hasBanInput);

    expect(changeFirstName).toHaveBeenCalledTimes(1);
    expect(changeLastName).toHaveBeenCalledTimes(1);
    expect(changeEmail).toHaveBeenCalledTimes(1);
    expect(changeHasBan).toHaveBeenCalledTimes(1);
  });

  it('renders submit button', () => {
    render(<UserSearchParams {...props} />);

    const submitbutton = screen.getByRole('button', {
      name: /szukaj/i,
    });

    expect(submitbutton).toBeInTheDocument();
  });

  it('calls setParams and changeSearchParams functions when form is submited', async () => {
    render(<UserSearchParams {...props} />);

    const submitbutton = screen.getByRole('button', {
      name: /szukaj/i,
    });

    await user.click(submitbutton);

    expect(changeSearchParams).toHaveBeenCalledWith(INITIAL_VALUES);
    expect(setParams).toHaveBeenCalledWith(INITIAL_VALUES);
  });
});
