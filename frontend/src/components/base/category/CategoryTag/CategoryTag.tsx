import type { ReactElement } from 'react';

import styles from './CategoryTag.module.css';

type Props = {
  name: string;
};

export function CategoryTag({ name }: Props): ReactElement {
  return <p className={styles.tag}>{name}</p>;
}
