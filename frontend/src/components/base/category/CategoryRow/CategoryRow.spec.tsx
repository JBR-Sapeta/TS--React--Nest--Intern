import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { CategoryRow } from './CategoryRow';

const selectCategory = vi.fn();

const SUBCATEGORIES = [
  {
    id: 17,
    name: 'Technik administracji',
    parentId: 1,
    children: [],
  },
  {
    id: 18,
    name: 'Technik archiwista',
    parentId: 1,
    children: [],
  },
  {
    id: 19,
    name: 'Technikprac biurowych',
    parentId: 1,
    children: [],
  },
  {
    id: 20,
    name: 'Recepcjonista',
    parentId: 1,
    children: [],
  },
];

const PROPS = {
  id: 1,
  name: 'Administracja',
  subCategories: SUBCATEGORIES,
  selectedCategories: [],
  selectCategory,
};

describe('CategoryRow', () => {
  it('does not display subcategories if the subcategories button has not been clicked', () => {
    render(<CategoryRow {...PROPS} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
  });

  it('renders button with category name', () => {
    render(<CategoryRow {...PROPS} />);

    const categoryButton = screen.getByRole('button', { name: PROPS.name });

    expect(categoryButton).toBeInTheDocument();
  });

  it('calls selectCategory function when category button has been clicked', async () => {
    render(<CategoryRow {...PROPS} />);

    const categoryButton = screen.getByRole('button', { name: PROPS.name });

    await user.click(categoryButton);

    expect(selectCategory).toHaveBeenCalledTimes(1);
  });

  it('renders subcategories when the subcategories button has been clicked', async () => {
    render(<CategoryRow {...PROPS} />);

    const subcategoriesButton = screen.getByRole('button', {
      name: /pokaż podkategorie/i,
    });

    await user.click(subcategoriesButton);

    const subcategoryButton = screen.getByRole('button', {
      name: SUBCATEGORIES[0].name,
    });

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(6);
    expect(subcategoryButton).toBeInTheDocument();
  });
});
