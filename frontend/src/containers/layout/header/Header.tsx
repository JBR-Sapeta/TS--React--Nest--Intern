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
import { useGetUserProfile, useLogout } from '@Data/auth';

import { NAVIGATION_LINKS } from './config';

import styles from './Header.module.css';

function Header(): ReactElement {
  const { userProfile } = useGetUserProfile();
  const { logoutMutation } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const userRole = userProfile
    ? Math.max(...userProfile.roles.map((role) => role.id))
    : UserRole.BASE;

  const links = NAVIGATION_LINKS.get(userRole);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <HeaderLogo />
        <div className={styles.controls}>
          <nav className={styles.navigation}>
            <NavigationLinks links={links} />
            {userProfile && (
              <LogoutButton onClick={() => logoutMutation(null)} />
            )}
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
