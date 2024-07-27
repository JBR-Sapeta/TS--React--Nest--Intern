import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BsPlusLg } from 'react-icons/bs';

import { ROUTER_PATHS } from '@Router/constants';

import styles from './AddBranchLink.module.css';

export function AddBranchLink(): ReactElement {
  return (
    <Link to={ROUTER_PATHS.CREATE_BRANCH} className={styles.link}>
      <BsPlusLg />
    </Link>
  );
}
