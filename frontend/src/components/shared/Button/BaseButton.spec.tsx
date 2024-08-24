import { vi, describe, it, expect } from 'vitest';
import { FaUser } from 'react-icons/fa';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import BaseButton from './BaseButton';

const BUTTON_LABEL = 'Button';

const onClick = vi.fn();

describe('BaseButton', () => {
  it(`renders '${BUTTON_LABEL}' text when it's provided as a children`, () => {
    render(
      <BaseButton color="red" size="small" onClick={onClick}>
        {BUTTON_LABEL}
      </BaseButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(BUTTON_LABEL);
  });

  it(`calls onClick when button is clicked`, async () => {
    render(
      <BaseButton color="red" size="small" onClick={onClick}>
        {BUTTON_LABEL}
      </BaseButton>
    );
    const button = screen.getByRole('button', { name: BUTTON_LABEL });
    await user.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it(`renders svg icon when LeftIcon property is provided `, () => {
    render(
      <BaseButton color="red" size="small" onClick={onClick} LeftIcon={FaUser}>
        {BUTTON_LABEL}
      </BaseButton>
    );
    const button = screen.getByRole('button');
    const childElements = button.querySelectorAll('*');
    expect(childElements).toHaveLength(2);
    expect(childElements[0].tagName).toBe('svg');
  });

  it(`renders svg icon when RightIcon property is provided `, () => {
    render(
      <BaseButton color="red" size="small" onClick={onClick} RightIcon={FaUser}>
        {BUTTON_LABEL}
      </BaseButton>
    );

    const button = screen.getByRole('button');

    const childElements = button.querySelectorAll('*');

    expect(childElements).toHaveLength(2);
    expect(childElements[0].tagName).toBe('svg');
  });

  it(`renders two icons when LeftIcon and RightIcon property is provided `, () => {
    render(
      <BaseButton
        color="red"
        size="small"
        onClick={onClick}
        LeftIcon={FaUser}
        RightIcon={FaUser}
      >
        {BUTTON_LABEL}
      </BaseButton>
    );

    const button = screen.getByRole('button');

    const childElements = button.querySelectorAll('*');

    expect(childElements).toHaveLength(4);
    expect(childElements[0].tagName).toBe('svg');
    expect(childElements[2].tagName).toBe('svg');
  });
});
