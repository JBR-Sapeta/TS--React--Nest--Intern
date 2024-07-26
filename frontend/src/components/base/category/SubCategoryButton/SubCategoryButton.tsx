import type { ReactElement } from 'react';
import clsx from 'clsx';

import type { CategoryPreview } from '@Data/types';

import styles from './SubCategoryButton.module.css';

type Props = {
  id: number;
  name: string;
  isSelected: boolean;
  onClick: (isSelected: boolean, category: CategoryPreview) => void;
};

export function SubCategoryButton({
  id,
  name,
  isSelected,
  onClick,
}: Props): ReactElement {
  const containerClassName = clsx(styles.container, {
    [styles.selectedContainer]: isSelected,
  });
  const buttonClassName = clsx(styles.button, {
    [styles.selectedButton]: isSelected,
  });

  return (
    <div className={containerClassName}>
      <button
        className={buttonClassName}
        type="button"
        onClick={() => onClick(isSelected, { id, name })}
      >
        {name}
      </button>
    </div>
  );
}
