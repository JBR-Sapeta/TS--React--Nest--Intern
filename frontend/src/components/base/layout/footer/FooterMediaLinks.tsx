import type { ReactElement } from 'react';
import { MediaLink } from '@Common/types';

import styles from './FooterMediaLinks.module.css';

type Props = {
  header: string;
  links: MediaLink[];
};

function FooterMediaLinks({ header, links }: Props): ReactElement {
  return (
    <div className={styles.container}>
      <h3>{header}</h3>
      <ul className={styles.list}>
        {links.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              className={styles.link}
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              <Icon />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterMediaLinks;
