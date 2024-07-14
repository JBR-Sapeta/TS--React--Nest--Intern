import { FooterLinks, FooterLogo, FooterMediaLinks } from '@Components/base';
import type { ReactElement } from 'react';

import { Hr } from '@Components/shared';

import { COMPANY_LINKS, MEDIA_LINKS, USER_LINKS } from './config';

import styles from './Footer.module.css';

function Footer(): ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <FooterLogo />
        <FooterLinks header="Dla Ucznia" links={USER_LINKS} />
        <FooterLinks header="Dla Firmy" links={COMPANY_LINKS} />
        <FooterMediaLinks header="Kontakt" links={MEDIA_LINKS} />
      </div>
      <div className={styles.rights}>
        <Hr />
        <p>Praktyka © {currentYear}, Wszelkie prawa zastrzeżone</p>
      </div>
    </footer>
  );
}

export default Footer;
