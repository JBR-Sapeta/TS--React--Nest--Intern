import type { ReactElement } from 'react';
import clsx from 'clsx';

import type { Nullable } from '@Common/types';

import styles from './CompanyLogo.module.css';

const DEFAULT_IMAGE = '/company-logo.png';

type Props = {
  type: 'small' | 'medium';
  url: Nullable<string>;
  hasPadding?: boolean;
  hasRadius?: boolean;
  name?: string;
};

export function CompanyLogo({
  type,
  url,
  hasPadding = false,
  hasRadius = false,
  name,
}: Props): ReactElement {
  const containerClassName = clsx(styles.container, {
    [styles.radiusSM]: hasRadius && type === 'small',
    [styles.radiusMD]: hasRadius && type === 'medium',
    [styles.paddingSM]: hasPadding && type === 'small',
    [styles.paddingMD]: hasPadding && type === 'medium',
  });
  const wrapperClassName = clsx(styles.wrapper, styles[type], {
    [styles.radiusSM]: hasRadius && type === 'small',
    [styles.radiusMD]: hasRadius && type === 'medium',
  });

  return (
    <div className={styles.content}>
      <div className={containerClassName}>
        <div className={wrapperClassName}>
          <picture className={styles.picture}>
            <img
              src={url || DEFAULT_IMAGE}
              alt="Logo firmy"
              className={styles.img}
            />
          </picture>
        </div>
      </div>
      {name && (
        <div className={styles.nameContainer}>
          <h2>{name}</h2>
        </div>
      )}
    </div>
  );
}
