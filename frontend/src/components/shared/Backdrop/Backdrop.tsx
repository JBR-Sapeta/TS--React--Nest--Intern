/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ReactElement } from 'react';

import styles from './Backdrop.module.css';

type Props = {
  onClick: () => void;
};

function Backdrop({ onClick }: Props): ReactElement {
  return (
    <div
      data-testid="backdropId"
      className={styles.backdrop}
      role="button"
      onClick={onClick}
    />
  );
}

export default Backdrop;
