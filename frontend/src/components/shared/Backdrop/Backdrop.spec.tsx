import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import Backdrop from './Backdrop';

const onClick = vi.fn();

describe('BaseButton', () => {
  it(`renders div with button role`, () => {
    render(<Backdrop onClick={onClick} />);

    const divButton = screen.getByTestId('backdropId');

    expect(divButton.tagName).toBe('DIV');
    expect(divButton.role).toBe('button');
  });

  it(`calls onClick when button is clicked`, async () => {
    render(<Backdrop onClick={onClick} />);

    const divButton = screen.getByTestId('backdropId');

    await user.click(divButton);

    expect(onClick).toHaveBeenCalled();
  });
});
