import type { ReactElement } from 'react';
import clsx from 'clsx';

import { CategoryTag } from '@Components/base';
import type { CategoryPreview } from '@Data/types';

import styles from './CategoryTags.module.css';

type Props = {
  categories: CategoryPreview[];
  className?: string;
};

export function CategoryTags({ categories, className }: Props): ReactElement {
  return (
    <div className={clsx(styles.container, className)}>
      {categories.map(({ id, name }) => (
        <CategoryTag key={id} name={name} />
      ))}
    </div>
  );
}
