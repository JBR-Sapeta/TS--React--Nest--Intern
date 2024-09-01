import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { CategoryTagButton } from './CategoryTagButton';

const onClick = vi.fn();

const PROPS = {
  id: 1,
  name: 'Administracja',
  onClick,
};

describe('CategoryTagButton', () => {
  it('renders category name', () => {
    render(<CategoryTagButton {...PROPS} />);

    const categoryName = screen.getByText(PROPS.name);

    expect(categoryName).toBeInTheDocument();
  });

  it('renders button to remove category', () => {
    render(<CategoryTagButton {...PROPS} />);

    const removeButton = screen.getByRole('button');

    expect(removeButton).toBeInTheDocument();
  });

  it('calls onClick function when remove button has been clicked', async () => {
    render(<CategoryTagButton {...PROPS} />);

    const removeButton = screen.getByRole('button');

    await user.click(removeButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
