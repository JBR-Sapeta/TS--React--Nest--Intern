import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { SelectInput } from './SelectInput';

const onChange = vi.fn();

const OPTIONS = [
  { value: '0', label: 'Select' },
  { value: '1', label: 'Audi' },
  { value: '2', label: 'BMW' },
  { value: '3', label: 'Ford' },
];

const inputProps = {
  name: 'Car Make',
  label: { id: 'car-make', text: 'Select car make' },
  options: OPTIONS,
  value: '0',
  onChange,
};

describe('SelectInput', () => {
  it(`renders slect input`, () => {
    render(<SelectInput {...inputProps} />);

    const input = screen.getByRole('combobox');

    expect(input).toBeInTheDocument();
  });

  it(`calls onChange when the user select new value`, async () => {
    render(<SelectInput {...inputProps} />);

    const input = screen.getByRole('combobox');

    await user.selectOptions(input, OPTIONS[0].value);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it(`displays label associated with selected value`, async () => {
    render(<SelectInput {...inputProps} />);

    const input = screen.getByRole('combobox');

    await user.selectOptions(input, OPTIONS[0].value);

    const inputWithValue = await screen.findByDisplayValue(OPTIONS[0].label);

    expect(inputWithValue).toBeInTheDocument();
  });

  it(`displays error text`, async () => {
    render(<SelectInput {...inputProps} error="Error" />);

    const input = screen.getByText('Error');

    expect(input).toBeInTheDocument();
  });
});
