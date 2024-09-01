import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { useGetApplicationFile } from '@Data/query/application';

import { CompanyApplicatio } from './CompanyApplicatio';

const USER = {
  id: 'b2b21f2b-d901-41aa-8b8a-898ded2228a6',
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@mail.com',
  phoneNumber: '755 543 866',
  createdAt: '2024-09-01T22:09:57.621Z',
  isActive: true,
};

const PROPS = {
  id: 2134,
  message: 'Application message.',
  createdAt: '2024-08-21T20:09:57.621Z',
  isDownloaded: false,
  user: USER,
};

const getApplicationFile = vi.fn();

vi.mock('@Data/query/application', () => ({
  useGetApplicationFile: vi.fn(),
}));

describe('CompanyApplicatio', () => {
  beforeEach(() => {
    vi.mocked(useGetApplicationFile).mockReturnValue({
      isPending: false,
      data: undefined,
      error: null,
      getApplicationFile,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders user firstname and lastname', () => {
    render(<CompanyApplicatio {...PROPS} />);

    expect(
      screen.getByText(`${USER.firstName} ${USER.lastName}`)
    ).toBeInTheDocument();
  });
  it('renders user phone number', () => {
    render(<CompanyApplicatio {...PROPS} />);

    expect(screen.getByText(USER.phoneNumber)).toBeInTheDocument();
  });
  it('renders user email address', () => {
    render(<CompanyApplicatio {...PROPS} />);

    expect(screen.getByText(USER.email)).toBeInTheDocument();
  });

  it('renders creation date', () => {
    render(<CompanyApplicatio {...PROPS} />);

    const [date] = PROPS.createdAt.split('T');

    expect(screen.getByText(date)).toBeInTheDocument();
  });

  it('renders button to download CV file', () => {
    render(<CompanyApplicatio {...PROPS} />);

    const downloadButton = screen.getByRole('button', { name: /pobierz cv/i });

    expect(downloadButton).toBeInTheDocument();
  });

  it('calls getApplicationFile function when button to download CV file has been clicked', async () => {
    render(<CompanyApplicatio {...PROPS} />);

    const downloadButton = screen.getByRole('button', { name: /pobierz cv/i });

    await user.click(downloadButton);

    expect(getApplicationFile).toBeCalledTimes(1);
  });
});
