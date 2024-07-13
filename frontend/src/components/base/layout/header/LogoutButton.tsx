import type { ReactElement } from 'react';

import styles from './LogoutButton.module.css';

type Props = {
  onClick: VoidFunction;
};

function LogoutButton({ onClick }: Props): ReactElement {
  return (
    <li>
      <button type="button" className={styles.button} onClick={onClick}>
        Wyloguj
      </button>
    </li>
  );
}

export default LogoutButton;
