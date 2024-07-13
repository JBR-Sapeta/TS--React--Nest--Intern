import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import styles from './LogoLink.module.css';

function LogoLink(): ReactElement {
  return (
    <Link to="/">
      <img className={styles.logo} src="/logo.svg" alt="Logo firmy" />
    </Link>
  );
}

export default LogoLink;
