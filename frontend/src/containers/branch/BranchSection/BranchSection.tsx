import { useState } from 'react';
import type { ReactElement } from 'react';

import { BranchMap } from '@Components/base';
import { Branch } from '@Data/types';

import { BranchList } from '../BranchList/BranchList';
import styles from './BranchSection.module.css';

type Props = {
  branches: Branch[];
  companyId: string;
  isOwner?: boolean;
};

export function BranchSection({
  branches,
  companyId,
  isOwner,
}: Props): ReactElement {
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);

  return (
    <section className={styles.section}>
      <h3 className={styles.h3}>Lokalizacje</h3>
      <BranchMap currentBranch={selectedBranch} branches={branches} />
      <BranchList
        companyId={companyId}
        branches={branches}
        selectedBranchId={selectedBranch.id}
        isOwner={isOwner}
        changeBranch={setSelectedBranch}
      />
    </section>
  );
}
