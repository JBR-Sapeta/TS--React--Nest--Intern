import type { Dispatch, ReactElement, SetStateAction } from 'react';

import type { Optional } from '@Common/types';
import type { Branch } from '@Data/types';
import { AddBranchLink, BranchItem } from '@Components/base';

import styles from './BranchList.module.css';

type Props = {
  companyId: string;
  branches: Branch[];
  selectedBranchId?: number;
  changeBranch: Dispatch<SetStateAction<Optional<Branch>>>;
  isOwner?: boolean;
};

export function BranchList({
  companyId,
  branches,
  selectedBranchId,
  changeBranch,
  isOwner,
}: Props): ReactElement {
  const onClick = (id: number) => {
    const branch = branches.find((val) => val.id === id);
    if (branch) {
      changeBranch(branch);
    }
  };

  return (
    <div className={styles.container}>
      {branches.map((branch) => (
        <BranchItem
          key={branch.id}
          {...branch}
          companyId={companyId}
          isSelected={selectedBranchId === branch.id}
          onClick={onClick}
          isOwner={isOwner}
        />
      ))}
      {isOwner && <AddBranchLink />}
    </div>
  );
}
