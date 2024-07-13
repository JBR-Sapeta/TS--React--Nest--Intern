import { useState } from 'react';
import type { ReactElement } from 'react';

import styles from './UiThemeButton.module.css';

function UiThemeButton(): ReactElement {
  const [selectedTheam, setSelectedTheam] = useState('DM');

  const onClick = () => {
    if (selectedTheam === 'DM') {
      setSelectedTheam('LM');
    } else {
      setSelectedTheam('DM');
    }
  };

  return (
    <button type="button" onClick={onClick} className={styles.button}>
      {selectedTheam}
    </button>
  );
}

export default UiThemeButton;
