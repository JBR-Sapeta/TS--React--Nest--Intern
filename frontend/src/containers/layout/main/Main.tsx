import type { PropsWithChildren, ReactElement } from 'react';

import styles from './Main.module.css';

function Main({ children }: PropsWithChildren<unknown>): ReactElement {
  return <main className={styles.main}>{children}</main>;
}

export default Main;
