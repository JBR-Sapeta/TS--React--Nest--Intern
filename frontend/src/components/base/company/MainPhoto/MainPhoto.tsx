import type { ReactElement } from 'react';

import type { Nullable } from '@Common/types';

import styles from './MainPhoto.module.css';

export const DEFAULT_IMAGE = '/company-main.png';

type Props = {
  url: Nullable<string>;
};

export function MainPhoto({ url }: Props): ReactElement {
  return (
    <div className={styles.container}>
      <picture className={styles.picture}>
        <img
          src={url || DEFAULT_IMAGE}
          alt="Logo firmy"
          className={styles.img}
        />
      </picture>
    </div>
  );
}
