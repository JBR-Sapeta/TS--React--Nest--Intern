import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { AdminCompanySearchParams } from './AdminCompanySearchParams';

const INITIAL_VALUES = {
  name: '',
  slug: '',
  email: '',
  owner: false,
  isVerified: false,
};

const changeName = vi.fn();
const changeSlug = vi.fn();
const changeEmail = vi.fn();
const changeOwner = vi.fn();
const changeIsVerified = vi.fn();
const changeSearchParams = vi.fn();
const setParams = vi.fn();

const props = {
  changeName,
  changeSlug,
  changeEmail,
  changeOwner,
  changeIsVerified,
  changeSearchParams,
  setParams,
  values: INITIAL_VALUES,
};

describe('AdminCompanySearchParams', () => {
  it('renders h2 with form name - "Szukaj firmy"', () => {
    render(<AdminCompanySearchParams {...props} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Szukaj firmy'
    );
  });

  it('renders five inputs', () => {
    render(<AdminCompanySearchParams {...props} />);

    const nameInput = screen.getByRole('textbox', { name: /nazwa firmy/i });
    const slugInput = screen.getByRole('textbox', { name: /slug/i });
    const emailInput = screen.getByRole('textbox', { name: /email firmy/i });
    const ownerInput = screen.getByRole('checkbox', { name: /użytkownik/i });
    const isVerifiedInput = screen.getByRole('checkbox', {
      name: /zweryfikowane/i,
    });

    expect(nameInput).toBeInTheDocument();
    expect(slugInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(ownerInput).toBeInTheDocument();
    expect(isVerifiedInput).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<AdminCompanySearchParams {...props} />);

    const submitbutton = screen.getByRole('button', {
      name: /szukaj/i,
    });

    expect(submitbutton).toBeInTheDocument();
  });

  it('calls input functions whenever the user enters a new value', async () => {
    render(<AdminCompanySearchParams {...props} />);

    const nameInput = screen.getByRole('textbox', { name: /nazwa firmy/i });
    const slugInput = screen.getByRole('textbox', { name: /slug/i });
    const emailInput = screen.getByRole('textbox', { name: /email firmy/i });
    const ownerInput = screen.getByRole('checkbox', { name: /użytkownik/i });
    const isVerifiedInput = screen.getByRole('checkbox', {
      name: /zweryfikowane/i,
    });

    await user.click(nameInput);
    await user.keyboard('A');

    await user.click(slugInput);
    await user.keyboard('A');

    await user.click(emailInput);
    await user.keyboard('A');

    await user.click(ownerInput);

    await user.click(isVerifiedInput);

    expect(changeName).toHaveBeenCalledTimes(1);
    expect(changeSlug).toHaveBeenCalledTimes(1);
    expect(changeEmail).toHaveBeenCalledTimes(1);
    expect(changeOwner).toHaveBeenCalledTimes(1);
    expect(changeIsVerified).toHaveBeenCalledTimes(1);
  });

  it('calls setParams and changeSearchParams functions when form is submited', async () => {
    render(<AdminCompanySearchParams {...props} />);

    const submitbutton = screen.getByRole('button', {
      name: /szukaj/i,
    });

    await user.click(submitbutton);

    expect(changeSearchParams).toHaveBeenCalledWith(INITIAL_VALUES);
    expect(setParams).toHaveBeenCalledWith(INITIAL_VALUES);
  });
});
