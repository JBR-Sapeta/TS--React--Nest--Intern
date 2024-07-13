import type { ReactElement } from 'react';
import { VscMenu, VscChromeClose } from 'react-icons/vsc';

import styles from './NavigationButton.module.css';

type Props = {
  onClick: VoidFunction;
  isMenuOpen: boolean;
};

function NavigationButton({ onClick, isMenuOpen }: Props): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      arial-label="Przycisk menu"
      className={styles.button}
    >
      {isMenuOpen ? (
        <VscChromeClose arial-label="Zamknij menu" />
      ) : (
        <VscMenu arial-label="Otwórz menu" />
      )}
    </button>
  );
}

export default NavigationButton;
