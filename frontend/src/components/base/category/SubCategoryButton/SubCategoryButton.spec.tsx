import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { SubCategoryButton } from './SubCategoryButton';

const onClick = vi.fn();

const PROPS = {
  id: 1,
  name: 'Administracja',
  isSelected: false,
  onClick,
};

describe('SubCategoryButton', () => {
  it('renders button with category name', () => {
    render(<SubCategoryButton {...PROPS} />);

    const categoryButton = screen.getByRole('button', { name: PROPS.name });

    expect(categoryButton).toBeInTheDocument();
  });

  it('calls onClick function when category button has been clicked', async () => {
    render(<SubCategoryButton {...PROPS} />);

    const categoryButton = screen.getByRole('button', { name: PROPS.name });

    await user.click(categoryButton);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(PROPS.isSelected, {
      id: PROPS.id,
      name: PROPS.name,
    });
  });
});
