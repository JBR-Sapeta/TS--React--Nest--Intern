import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { CategoryButton } from './CategoryButton';

const onClick = vi.fn();
const showSubCategories = vi.fn();

const PROPS = {
  id: 2131,
  name: 'Administracja',
  isOpen: false,
  isSelected: false,
  showSubCategories,
  onClick,
};

describe('CategoryButton', () => {
  it('renders button with category name', () => {
    render(<CategoryButton {...PROPS} />);

    const categoryButton = screen.getByRole('button', { name: PROPS.name });

    expect(categoryButton).toBeInTheDocument();
  });

  it('calls onClick function when category button has been clicked', async () => {
    render(<CategoryButton {...PROPS} />);

    const categoryButton = screen.getByRole('button', { name: PROPS.name });

    await user.click(categoryButton);

    expect(onClick).toHaveBeenCalledWith(
      PROPS.isSelected,
      { id: PROPS.id, name: PROPS.name },
      PROPS.isOpen
    );
  });

  it('renders button to displey subcategories', () => {
    render(<CategoryButton {...PROPS} />);

    const subcategoriesButton = screen.getByRole('button', {
      name: /pokaż podkategorie/i,
    });

    expect(subcategoriesButton).toBeInTheDocument();
  });

  it('calls showSubCategories function when subcategories button has been clicked', async () => {
    render(<CategoryButton {...PROPS} />);

    const subcategoriesButton = screen.getByRole('button', {
      name: /pokaż podkategorie/i,
    });

    await user.click(subcategoriesButton);

    expect(showSubCategories).toHaveBeenCalledTimes(1);
  });
});
