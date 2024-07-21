import type { PropsWithChildren, ReactElement } from 'react';
import styles from './ModalWrapper.module.css';

function ModalWrapper({ children }: PropsWithChildren): ReactElement {
  return <div className={styles.modal}>{children}</div>;
}

export default ModalWrapper;
