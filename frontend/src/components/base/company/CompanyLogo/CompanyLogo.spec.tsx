import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { CompanyLogo, DEFAULT_IMAGE } from './CompanyLogo';

const URL = '/logo.png';
const NAME = 'Lorem Ipsum';

describe('CompanyLogo', () => {
  it('renders company logo', () => {
    render(<CompanyLogo url={URL} type="small" />);

    const companyLogo = screen.getByAltText(/logo firmy/i);

    expect(companyLogo).toBeInTheDocument();
    expect(companyLogo).toHaveAttribute('src', URL);
  });

  it('renders default company logo if value of provided url is null', () => {
    render(<CompanyLogo url={null} type="small" />);

    const companyLogo = screen.getByAltText(/logo firmy/i);

    expect(companyLogo).toBeInTheDocument();
    expect(companyLogo).toHaveAttribute('src', DEFAULT_IMAGE);
  });

  it('renders h2 with name value if name property is provided', () => {
    render(<CompanyLogo url={null} type="small" name={NAME} />);

    const name = screen.getByRole('heading', { level: 2 });

    expect(name).toHaveTextContent(NAME);
  });
});
