import type { Dispatch, ReactElement, SetStateAction } from 'react';

import { useGetCategories } from '@Data/query/category/';
import { CategoryPreview } from '@Data/types';

import { CategoryRow, SelectedCategoryTags } from '@Components/base';

import styles from './SelectCategory.module.css';

type Props = {
  selectedCategories: CategoryPreview[];
  selectCategory: Dispatch<SetStateAction<CategoryPreview[]>>;
  errorMessage?: string;
};

export function SelectCategory({
  selectCategory,
  selectedCategories,
  errorMessage,
}: Props): ReactElement {
  const { categories } = useGetCategories();

  return (
    <>
      <div className={styles.container}>
        {categories &&
          categories.map(({ id, name, children }) => (
            <CategoryRow
              key={id}
              id={id}
              name={name}
              subCategories={children}
              selectedCategories={selectedCategories}
              selectCategory={selectCategory}
            />
          ))}
      </div>
      <SelectedCategoryTags
        selectedCategories={selectedCategories}
        selectCategory={selectCategory}
        errorMessage={errorMessage}
      />
    </>
  );
}
