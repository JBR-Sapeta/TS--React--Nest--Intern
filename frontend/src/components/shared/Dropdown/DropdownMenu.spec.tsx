import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { DropdownItem } from './DropdownItem';
import { DropdownMenu } from './DropdownMenu';

const onClick = vi.fn();

const DROPDOWN_LABEL = 'Actions';

const dropdownList = (
  <>
    <DropdownItem onClick={onClick} isLink={false}>
      Add
    </DropdownItem>
    <DropdownItem onClick={onClick} isLink={false}>
      Delete
    </DropdownItem>
  </>
);

describe('DropdownMenu', () => {
  it(`renders button with provided label`, async () => {
    render(<DropdownMenu label={DROPDOWN_LABEL}>{dropdownList}</DropdownMenu>);

    const button = await screen.findByRole('button', { name: DROPDOWN_LABEL });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(DROPDOWN_LABEL);
  });

  it(`does not render children if the button was not pressed`, async () => {
    render(<DropdownMenu label={DROPDOWN_LABEL}>{dropdownList}</DropdownMenu>);

    const buttons = await screen.findAllByRole('button');

    expect(buttons).toHaveLength(1);
  });

  it(`renders children if the button was pressed`, async () => {
    render(<DropdownMenu label={DROPDOWN_LABEL}>{dropdownList}</DropdownMenu>);

    const button = await screen.findByRole('button', { name: DROPDOWN_LABEL });

    await user.click(button);

    const buttons = await screen.findAllByRole('button');

    expect(buttons).toHaveLength(3);
  });
});
