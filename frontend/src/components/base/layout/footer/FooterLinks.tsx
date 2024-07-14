import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { NavigationLink } from '@Common/types';

import styles from './FooterLinks.module.css';

type Props = {
  header: string;
  links: NavigationLink[];
};

function FooterLinks({ header, links }: Props): ReactElement {
  return (
    <div className={styles.container}>
      <h3>{header}</h3>
      <ul className={styles.list}>
        {links.map(({ label, path }) => (
          <li key={label}>
            <Link to={path} className={styles.link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterLinks;
