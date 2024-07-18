import { useState } from 'react';
import type { ReactElement } from 'react';

import {
  HeaderLogo,
  LogoutButton,
  NavigationButton,
  NavigationLinks,
  UiThemeButton,
} from '@Components/base';
import { UserRole } from '@Common/enums';

import { NAVIGATION_LINKS } from './config';

import styles from './Header.module.css';

function Header(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const links = NAVIGATION_LINKS.get(UserRole.BASE);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <HeaderLogo />
        <div className={styles.controls}>
          <nav className={styles.navigation}>
            <NavigationLinks links={links} />
            <LogoutButton onClick={() => {}} />
          </nav>
          <UiThemeButton />
          <NavigationButton
            isMenuOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((state) => !state)}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
