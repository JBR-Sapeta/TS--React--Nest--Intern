/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ReactElement } from 'react';

import styles from './Backdrop.module.css';

type Props = {
  onClick: () => void;
};

function Backdrop({ onClick }: Props): ReactElement {
  return <div className={styles.backdrop} onClick={onClick} />;
}

export default Backdrop;
