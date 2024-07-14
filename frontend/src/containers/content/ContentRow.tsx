import { PropsWithChildren, ReactElement } from 'react';
import clsx from 'clsx';

import styles from './ContentRow.module.css';

type Props = PropsWithChildren<{ margin: 'small' | 'medium' }>;

function ContentRow({ margin, children }: Props): ReactElement {
  return <div className={clsx(styles.row, styles[margin])}>{children}</div>;
}

export default ContentRow;
