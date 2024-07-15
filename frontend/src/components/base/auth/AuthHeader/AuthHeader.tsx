import type { ReactElement } from 'react';

import { Hr } from '../../../shared';

import styles from './AuthHeader.module.css';

type Props = {
  header: string;
  subHeader: string;
};

function AuthHeader({ header, subHeader }: Props): ReactElement {
  return (
    <div className={styles.container}>
      <h2>{header}</h2>
      <Hr className={styles.hr} />
      <p>{subHeader}</p>
    </div>
  );
}

export default AuthHeader;
