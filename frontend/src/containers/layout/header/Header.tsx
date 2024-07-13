import { useState } from 'react';
import type { ReactElement } from 'react';

import {
  LogoLink,
  LogoutButton,
  NavigationButton,
  NavigationLinks,
  UiThemeButton,
} from '@Components/base';
import { Users } from '@Common/enums';

import { NAVIGATION_LINKS } from './config';

import styles from './Header.module.css';

function Header(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const links = NAVIGATION_LINKS.get(Users.BASE);

  return (
    <header className={styles.header}>
      <LogoLink />
      <div>
        <UiThemeButton />
        <nav>
          <NavigationLinks links={links} />
          <LogoutButton onClick={() => {}} />
        </nav>
        <NavigationButton
          isMenuOpen={isMenuOpen}
          onClick={() => setIsMenuOpen((state) => !state)}
        />
      </div>
    </header>
  );
}

export default Header;
