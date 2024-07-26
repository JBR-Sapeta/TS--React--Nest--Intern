import type { Dispatch, ReactElement, SetStateAction } from 'react';

import type { CategoryPreview } from '@Data/types';

import { CategoryTagButton } from '../CategoryTagButton/CategoryTagButton';

import styles from './SelectedCategoryTags.module.css';

type Props = {
  selectedCategories: CategoryPreview[];
  selectCategory: Dispatch<SetStateAction<CategoryPreview[]>>;
  errorMessage?: string;
};

export function SelectedCategoryTags({
  selectCategory,
  selectedCategories,
  errorMessage,
}: Props): ReactElement {
  const onClick = (category: CategoryPreview) => {
    selectCategory((state) => [
      ...state.filter((val) => val.id !== category.id),
    ]);
  };

  const showError = selectedCategories.length === 0 && errorMessage;

  return (
    <div className={styles.container}>
      <h3>Wybrane:</h3>
      <div className={styles.tags}>
        {selectedCategories.map(({ id, name }) => (
          <CategoryTagButton key={id} id={id} name={name} onClick={onClick} />
        ))}
      </div>
      {showError && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}
