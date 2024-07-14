import type { ReactElement } from 'react';
import clsx from 'clsx';

import styles from './Hr.module.css';

type Props = {
  className?: string;
};

function Hr({ className }: Props): ReactElement {
  return <hr className={clsx(styles.hr, className)} />;
}

export default Hr;
