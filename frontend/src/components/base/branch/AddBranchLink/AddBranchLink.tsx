import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BsPlusLg } from 'react-icons/bs';

import { ROUTER_PATHS } from '@Router/constants';

import styles from './AddBranchLink.module.css';

export function AddBranchLink(): ReactElement {
  return (
    <Link to={ROUTER_PATHS.COMPANY_CREATE_BRANCHES} className={styles.link}>
      <BsPlusLg />
    </Link>
  );
}
