/* eslint-disable @typescript-eslint/no-shadow */
import { useState } from 'react';
import type { Dispatch, ReactElement, SetStateAction } from 'react';
import clsx from 'clsx';

import type { CategoryPreview, SubCategory } from '@Data/types';

import { CategoryButton } from '../CategoryButton/CategoryButton';
import { SubCategoryButton } from '../SubCategoryButton/SubCategoryButton';

import styles from './CategoryRow.module.css';

type Props = {
  id: number;
  name: string;
  subCategories: SubCategory[];
  selectedCategories: CategoryPreview[];
  selectCategory: Dispatch<SetStateAction<CategoryPreview[]>>;
};

export function CategoryRow({
  id,
  name,
  subCategories,
  selectedCategories,
  selectCategory,
}: Props): ReactElement {
  const [showSubCategories, setShowSubCategories] = useState(false);
  const selectedIds = selectedCategories.map((val) => val.id);

  const onClick = (
    isSelected: boolean,
    category: CategoryPreview,
    isOpen = false
  ) => {
    if (isOpen) return;

    if (isSelected) {
      selectCategory((state) => [
        ...state.filter((val) => val.id !== category.id),
      ]);
    } else {
      selectCategory((state) => [...state, category]);
    }
  };

  return (
    <div className={clsx({ [styles.open]: showSubCategories })}>
      <div className={styles.container}>
        <CategoryButton
          id={id}
          name={name}
          isOpen={showSubCategories}
          isSelected={selectedIds.includes(id)}
          onClick={onClick}
          showSubCategories={() => setShowSubCategories((val) => !val)}
        />
        {showSubCategories &&
          subCategories.map((props) => (
            <SubCategoryButton
              key={props.id}
              isSelected={selectedIds.includes(props.id)}
              onClick={onClick}
              {...props}
            />
          ))}
      </div>
    </div>
  );
}
