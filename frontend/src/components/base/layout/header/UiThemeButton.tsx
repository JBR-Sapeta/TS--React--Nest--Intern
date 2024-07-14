import { useState } from 'react';
import type { ReactElement } from 'react';
import { FaMoon } from 'react-icons/fa6';
import { MdSunny } from 'react-icons/md';
import clsx from 'clsx';

import styles from './UiThemeButton.module.css';

enum UiMode {
  DARK = 'dark',
  LIGHT = 'light',
}

function UiThemeButton(): ReactElement {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onClick = () => {
    setIsDarkMode((state) => !state);

    if (isDarkMode) {
      document.querySelector('body')?.classList.remove(UiMode.DARK);
    } else {
      document.querySelector('body')?.classList.add(UiMode.DARK);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.button, {
        [styles.dark]: isDarkMode,
        [styles.light]: !isDarkMode,
      })}
    >
      <div className={styles.circle}>
        {isDarkMode ? <FaMoon /> : <MdSunny />}
      </div>
    </button>
  );
}

export default UiThemeButton;
