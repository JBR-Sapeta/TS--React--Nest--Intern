import type { ReactElement } from 'react';

import { Branch } from '@Data/types';
import { BranchItem } from '@Components/base';

import styles from './BranchList.module.css';

type Props = {
  branches: Branch[];
  isOwner?: boolean;
};

export function BranchList({ branches, isOwner }: Props): ReactElement {
  return (
    <div className={styles.container}>
      {branches.map((branch) => (
        <BranchItem key={branch.id} {...branch} isOwner={isOwner} />
      ))}
    </div>
  );
}
