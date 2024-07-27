import type { ReactElement } from 'react';

import { Branch } from '@Data/types';

import { BranchList } from '../BranchList/BranchList';
import styles from './BranchSection.module.css';

type Props = {
  branches: Branch[];
  isOwner?: boolean;
};

export function BranchSection({ branches, isOwner }: Props): ReactElement {
  return (
    <section className={styles.section}>
      <h3 className={styles.h3}>Lokalizacje</h3>
      <BranchList branches={branches} isOwner={isOwner} />
    </section>
  );
}
