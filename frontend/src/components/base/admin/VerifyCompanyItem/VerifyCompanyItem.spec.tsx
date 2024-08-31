import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { VerifyCompanyItem } from './VerifyCompanyItem';

const userData = {
  id: 'b2b21f2b-d901-41aa-8b8a-898ded2228a6',
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@mail.com',
  phoneNumber: '755 543 866',
  createdAt: '2024-09-01T22:09:57.621Z',
  isActive: true,
  hasBan: false,
};

const props = {
  id: '8eef6a0d-554f-4b9f-87e0-83d236152c75',
  name: 'new-company',
  logoUrl: 'log.png',
  isVerified: true,
  email: 'ninfo@newcompany.com',
  phoneNumber: '643 753 892',
  slug: 'new-comapny',
  size: 100,
  owner: userData,
};

describe('SignInForm', () => {
  it('renders company name in h3', () => {
    render(<VerifyCompanyItem {...props} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      `${props.name}`
    );
  });
  it('renders comapny phone number', () => {
    render(<VerifyCompanyItem {...props} />);

    expect(screen.getByText(props.phoneNumber)).toBeInTheDocument();
  });
  it('renders comapny email address', () => {
    render(<VerifyCompanyItem {...props} />);

    expect(screen.getByText(props.email)).toBeInTheDocument();
  });

  it('renders owner firstname and lastname when owner data is attached', () => {
    render(<VerifyCompanyItem {...props} />);

    expect(
      screen.getByText(`${userData.firstName} ${userData.lastName}`)
    ).toBeInTheDocument();
  });

  it('renders owner email address', () => {
    render(<VerifyCompanyItem {...props} />);

    expect(screen.getByText(userData.email)).toBeInTheDocument();
  });

  it('renders dropdown button', () => {
    render(<VerifyCompanyItem {...props} />);

    const dropdownButton = screen.getByRole('button', {
      name: /przycisk menu/i,
    });

    expect(dropdownButton).toBeInTheDocument();
  });

  it('renders verification button when comapny is not verified ansd dropdown is open', async () => {
    render(<VerifyCompanyItem {...props} isVerified={false} />);

    const dropdownButton = screen.getByRole('button', {
      name: /przycisk menu/i,
    });

    await user.click(dropdownButton);

    const verificationButton = screen.getByRole('button', {
      name: /zweryfikuj/i,
    });

    expect(verificationButton).toBeInTheDocument();
  });

  it('renders undo verification button when comapny is verified ansd dropdown is open', async () => {
    render(<VerifyCompanyItem {...props} />);

    const dropdownButton = screen.getByRole('button', {
      name: /przycisk menu/i,
    });

    await user.click(dropdownButton);

    const undoVerificationButton = screen.getByRole('button', {
      name: /cofnij weryfikację/i,
    });

    expect(undoVerificationButton).toBeInTheDocument();
  });
});
