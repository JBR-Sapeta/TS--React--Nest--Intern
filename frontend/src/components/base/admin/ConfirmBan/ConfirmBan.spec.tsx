/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { useBanUser } from '@Data/query/admin';

import { ConfirmBan } from './ConfirmBan';

const closeModal = vi.fn();
const banUserMutation = vi.fn();

const props = {
  closeModal,
  userId: 'b2b21f2b-d901-41aa-8b8a-898ded2228a6',
};

vi.mock('@Data/query/admin', () => ({
  useBanUser: vi.fn(),
}));

describe('ConfirmBan', () => {
  beforeEach(() => {
    vi.mocked(useBanUser).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      banUserMutation,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders h3 with section name - "Blokada użytkownika"', () => {
    render(<ConfirmBan {...props} hasBan />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Blokada użytkownika'
    );
  });

  it('renders ban button when user has no ban', () => {
    render(<ConfirmBan {...props} hasBan={false} />);

    const banButton = screen.getByRole('button', { name: /zablokuj/i });

    expect(banButton).toBeInTheDocument();
  });

  it('calls banUserMutation function when the ban button has been clicked ', async () => {
    render(<ConfirmBan {...props} hasBan={false} />);

    const banButton = screen.getByRole('button', { name: /zablokuj/i });

    await user.click(banButton);

    expect(banUserMutation).toHaveBeenCalledTimes(1);
  });

  it('renders unban button when user has a ban', () => {
    render(<ConfirmBan {...props} hasBan />);

    const unbanButton = screen.getByRole('button', { name: /odblokuj/i });

    expect(unbanButton).toBeInTheDocument();
  });

  it('calls banUserMutation function when the unban button has been clicked ', async () => {
    render(<ConfirmBan {...props} hasBan />);

    const unbanButton = screen.getByRole('button', { name: /odblokuj/i });

    await user.click(unbanButton);

    expect(banUserMutation).toHaveBeenCalledTimes(1);
  });

  it('renders close modal button', () => {
    render(<ConfirmBan {...props} hasBan />);

    const closeButton = screen.getByRole('button', { name: /zamknij/i });

    expect(closeButton).toBeInTheDocument();
  });

  it('calls closeModal function when the close button has been clicked', async () => {
    render(<ConfirmBan {...props} hasBan />);

    const closeButton = screen.getByRole('button', { name: /zamknij/i });

    await user.click(closeButton);

    expect(closeModal).toBeCalledTimes(1);
  });

  it('shows success message when request succeed', () => {
    vi.mocked(useBanUser).mockReturnValue({
      isPending: false,
      data: { message: 'Sukces !', statusCode: 200, error: null },
      error: null,
      banUserMutation,
    });

    render(<ConfirmBan {...props} hasBan />);

    expect(screen.getByText('Sukces !')).toBeInTheDocument();
  });

  it('shows error message when request failed', () => {
    vi.mocked(useBanUser).mockReturnValue({
      isPending: false,
      data: undefined,
      error: {
        // @ts-ignore
        response: {
          data: {
            message: 'Coś poszło nie tak.',
            statusCode: 500,
            error: 'Bad Request',
          },
        },
      },
      banUserMutation,
    });

    render(<ConfirmBan {...props} hasBan />);

    expect(screen.getByText('Coś poszło nie tak.')).toBeInTheDocument();
  });
});
