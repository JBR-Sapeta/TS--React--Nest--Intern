import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { UserPreview } from './UserPreview';

const props = {
  id: 'b2b21f2b-d901-41aa-8b8a-898ded2228a6',
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@mail.com',
  phoneNumber: '755 543 866',
  createdAt: '2024-09-01T22:09:57.621Z',
  isActive: true,
};

describe('SignInForm', () => {
  it('renders user firstname and lastname in h3', () => {
    render(<UserPreview {...props} hasBan />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      `${props.firstName} ${props.lastName}`
    );
  });
  it('renders user phone number', () => {
    render(<UserPreview {...props} hasBan />);

    expect(screen.getByText(props.phoneNumber)).toBeInTheDocument();
  });
  it('renders user email address', () => {
    render(<UserPreview {...props} hasBan />);

    expect(screen.getByText(props.email)).toBeInTheDocument();
  });

  it('renders registration date', () => {
    render(<UserPreview {...props} hasBan />);

    const [date, time] = props.createdAt.split('T');
    const dateText = `${date} - ${time.split('.')[0]}`;

    expect(screen.getByText(dateText)).toBeInTheDocument();
  });

  it('renders unban button when user has a ban', () => {
    render(<UserPreview {...props} hasBan />);

    const unbanButton = screen.getByRole('button', { name: /odblokuj/i });

    expect(unbanButton).toBeInTheDocument();
  });

  it('renders ban button when user has no ban', () => {
    render(<UserPreview {...props} hasBan={false} />);

    const banButton = screen.getByRole('button', { name: /zablokuj/i });

    expect(banButton).toBeInTheDocument();
  });
});
