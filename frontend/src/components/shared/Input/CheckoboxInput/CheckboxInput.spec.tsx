/* eslint-disable react/jsx-boolean-value */
import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { CheckboxInput } from './CheckoboxInput';

const onChange = vi.fn();

const inputProps = {
  name: 'name',
  label: { id: 'name', text: 'Name' },
  value: false,
  onChange,
};

describe('CheckboxInput', () => {
  it(`renders checkbox field`, () => {
    render(<CheckboxInput {...inputProps} />);

    const input = screen.getByRole('checkbox');

    expect(input).toBeInTheDocument();
  });

  it(`marks the field as not checked when valueis set to false `, () => {
    render(<CheckboxInput {...inputProps} />);

    const input = screen.getByRole('checkbox');

    expect(input).not.toBeChecked();
  });

  it(`marks the field as checked when value is set to true `, () => {
    render(<CheckboxInput {...inputProps} value={true} />);

    const input = screen.getByRole('checkbox');

    expect(input).toBeChecked();
  });

  it(`calls onChange when the user click checkbox`, async () => {
    render(<CheckboxInput {...inputProps} />);

    const input = screen.getByRole('checkbox');

    await user.click(input);

    expect(onChange).toHaveBeenCalled();
  });
});
