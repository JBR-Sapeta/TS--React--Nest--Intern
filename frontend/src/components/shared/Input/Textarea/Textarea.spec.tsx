import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { Textarea } from './Textarea';

const onChange = vi.fn();

const inputProps = {
  name: 'name',
  label: { id: 'name', text: 'Name' },
  onChange,
};

describe('Textarea', () => {
  it(`renders textarea field`, () => {
    render(<Textarea inputSize="small" {...inputProps} />);

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
  });

  it(`calls onChange when the user types a text`, async () => {
    render(<Textarea inputSize="small" {...inputProps} />);

    const input = screen.getByRole('textbox');

    await user.click(input);
    await user.keyboard('John');

    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it(`displays entered text`, async () => {
    render(<Textarea inputSize="small" {...inputProps} />);

    const input = screen.getByRole('textbox');

    await user.click(input);
    await user.keyboard('John');

    const inputWithValue = await screen.findByDisplayValue('John');

    expect(inputWithValue).toBeInTheDocument();
  });

  it(`displays error text`, async () => {
    render(<Textarea inputSize="small" {...inputProps} error="Error" />);

    const input = screen.getByText('Error');

    expect(input).toBeInTheDocument();
  });
});
