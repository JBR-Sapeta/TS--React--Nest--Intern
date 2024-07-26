import type { ReactElement } from 'react';
import { FaXmark } from 'react-icons/fa6';

import type { CategoryPreview } from '@Data/types';

import styles from './CategoryTagButton.module.css';

type Props = {
  id: number;
  name: string;
  onClick: (category: CategoryPreview) => void;
};

export function CategoryTagButton({ id, name, onClick }: Props): ReactElement {
  return (
    <div className={styles.container}>
      <p>{name}</p>
      <button
        type="button"
        aria-label="Usuń kategorie"
        onClick={() => onClick({ id, name })}
        className={styles.button}
      >
        <FaXmark />
      </button>
    </div>
  );
}
