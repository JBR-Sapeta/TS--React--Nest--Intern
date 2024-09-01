import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import AuthSideCard from './AuthSideCard';

const fisrtButtonFun = vi.fn();
const secondButtonFun = vi.fn();

const BUTTON_PROPS = {
  fisrtButton: { label: 'Zaloguj się', onClick: fisrtButtonFun },
  secondButton: { label: 'Zarejestruj się', onClick: secondButtonFun },
};

const LINK_PROPS = {
  hasLink: true,
  link: { label: 'Zaloguj się', path: '/' },
};

describe('AuthSideCard', () => {
  it('renders h3 with service name', () => {
    render(<AuthSideCard {...BUTTON_PROPS} hasLink={false} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Praktyka'
    );
  });

  it('renders two buttons when ButtonData is provided', () => {
    render(<AuthSideCard {...BUTTON_PROPS} hasLink={false} />);

    const firstButton = screen.getByRole('button', {
      name: BUTTON_PROPS.fisrtButton.label,
    });

    const secondButton = screen.getByRole('button', {
      name: BUTTON_PROPS.secondButton.label,
    });

    expect(firstButton).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();
  });

  it('renders one link  when LinkData is provided', () => {
    render(
      <MemoryRouter>
        <AuthSideCard {...LINK_PROPS} hasLink />
      </MemoryRouter>
    );

    const link = screen.getByText(LINK_PROPS.link.label);

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', LINK_PROPS.link.path);
  });
});
