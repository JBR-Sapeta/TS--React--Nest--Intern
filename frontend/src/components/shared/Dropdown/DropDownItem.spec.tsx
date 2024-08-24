import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import { DropdownItem } from './DropdownItem';

const BUTTON_LABEL = 'Button Label';
const LINK_LABEL = 'Link Label';

const onClick = vi.fn();

describe('DropdownItem', () => {
  it(`renders button with text when isLink is set to false`, () => {
    render(
      <DropdownItem onClick={onClick} isLink={false}>
        {BUTTON_LABEL}
      </DropdownItem>
    );

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent(BUTTON_LABEL);
  });

  it(`renders button with '${BUTTON_LABEL}' text when it's provided as a child`, () => {
    render(
      <DropdownItem onClick={onClick} isLink={false}>
        {BUTTON_LABEL}
      </DropdownItem>
    );

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent(BUTTON_LABEL);
  });

  it(`calls onClick when button is clicked`, async () => {
    render(
      <DropdownItem onClick={onClick} isLink={false}>
        {BUTTON_LABEL}
      </DropdownItem>
    );

    const button = screen.getByRole('button', { name: BUTTON_LABEL });

    await user.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it(`renders link with text when isLink is set to true`, () => {
    render(
      <MemoryRouter>
        <DropdownItem path="/" isLink>
          {LINK_LABEL}
        </DropdownItem>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveTextContent(LINK_LABEL);
  });

  it(`renders link with '${LINK_LABEL}' text when it's provided as a child`, () => {
    render(
      <MemoryRouter>
        <DropdownItem path="/" isLink>
          {LINK_LABEL}
        </DropdownItem>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveTextContent(LINK_LABEL);
  });
});
