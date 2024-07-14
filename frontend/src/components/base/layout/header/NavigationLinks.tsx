import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import type { NavigationLink } from '@Common/types';

import styles from './NavigationLinks.module.css';

type Props = {
  links: NavigationLink[];
};

function NavigationLinks({ links }: Props): ReactElement {
  return (
    <ul className={styles.list}>
      {links.map(({ label, path }) => (
        <li key={label}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              clsx(styles.link, { [styles.active]: isActive })
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default NavigationLinks;
