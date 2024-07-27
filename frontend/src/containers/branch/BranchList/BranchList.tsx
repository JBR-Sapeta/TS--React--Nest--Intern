import type { Dispatch, ReactElement, SetStateAction } from 'react';

import { Branch } from '@Data/types';
import { BranchItem } from '@Components/base';

import styles from './BranchList.module.css';

type Props = {
  branches: Branch[];
  changeBranch: Dispatch<SetStateAction<Branch>>;
  isOwner?: boolean;
};

export function BranchList({
  branches,
  isOwner,
  changeBranch,
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
          isOwner={isOwner}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
