import type { ReactElement } from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FaXmark } from 'react-icons/fa6';
import clsx from 'clsx';

import type { CategoryPreview } from '@Data/types';

import styles from './CategoryButton.module.css';

type Props = {
  id: number;
  name: string;
  isOpen: boolean;
  isSelected: boolean;
  showSubCategories: VoidFunction;
  onClick: (
    isSelected: boolean,
    category: CategoryPreview,
    isOpen?: boolean
  ) => void;
};

export function CategoryButton({
  id,
  name,
  isOpen,
  isSelected,
  onClick,
  showSubCategories,
}: Props): ReactElement {
  const containerClassName = clsx(styles.container, {
    [styles.selectedContainer]: isSelected,
    [styles.openContainer]: isOpen,
  });
  const categoryButtonClassName = clsx(styles.categorybutton, {
    [styles.selectedButton]: isSelected,
    [styles.openButton]: isOpen,
  });

  return (
    <div className={containerClassName}>
      <button
        className={categoryButtonClassName}
        type="button"
        onClick={() => onClick(isSelected, { id, name }, isOpen)}
      >
        {name}
      </button>
      <button
        className={styles.subCategories}
        type="button"
        aria-label="Pokaż podkategorie"
        onClick={showSubCategories}
      >
        {isOpen ? <FaXmark /> : <TiArrowSortedDown />}
      </button>
    </div>
  );
}
