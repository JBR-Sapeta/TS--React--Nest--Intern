import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { SelectedCategoryTags } from './SelectedCategoryTags';

const selectCategory = vi.fn();

const SELECTED_CATEGORIES = [{ id: 1, name: ' Administracja' }];

const PROPS = {
  selectedCategories: SELECTED_CATEGORIES,
  errorMessage: 'Wymagany jest wybór minimum jednej kategorii.',
  selectCategory,
};

describe('SelectedCategoryTags', () => {
  it('renders category tag buttons', () => {
    render(<SelectedCategoryTags {...PROPS} />);

    const removeCategoryButton = screen.getByRole('button', {
      name: /usuń kategorie/i,
    });

    expect(removeCategoryButton).toBeInTheDocument();
  });

  it('calls selectCategory function button when remove button has been clicked', async () => {
    render(<SelectedCategoryTags {...PROPS} />);

    const removeCategoryButton = screen.getByRole('button', {
      name: /usuń kategorie/i,
    });

    await user.click(removeCategoryButton);

    expect(selectCategory).toHaveBeenCalledTimes(1);
  });

  it('renders error message when selectedCategories ia an empty array and errorMessage property is provided', () => {
    render(<SelectedCategoryTags {...PROPS} selectedCategories={[]} />);

    const errorMessage = screen.getByText(PROPS.errorMessage);

    expect(errorMessage).toBeInTheDocument();
  });
});
