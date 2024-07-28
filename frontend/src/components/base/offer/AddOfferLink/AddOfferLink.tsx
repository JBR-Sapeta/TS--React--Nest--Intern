import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BsPlusLg } from 'react-icons/bs';

import { ROUTER_PATHS } from '@Router/constants';

import styles from './AddOfferLink.module.css';

export function AddOfferLink(): ReactElement {
  return (
    <Link to={ROUTER_PATHS.COMPANY_OFFER_CREATE} className={styles.link}>
      <BsPlusLg /> <span>Nowa oferta</span>
    </Link>
  );
}
