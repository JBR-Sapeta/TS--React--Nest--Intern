import type { Dispatch, ReactElement, SetStateAction } from 'react';

import { Branch } from '@Data/types';

import { BranchItem } from '@Components/base';

import { isEmpty } from 'ramda';
import styles from './SelectBranch.module.css';

type Props = {
  branches: Branch[];
  selectedBranches: number[];
  selectBranch: Dispatch<SetStateAction<number[]>>;
  errorMessage?: string;
};

export function SelectBranch({
  branches,
  selectBranch,
  selectedBranches,
  errorMessage,
}: Props): ReactElement {
  const onClick = (id: number) => {
    selectBranch((state) => {
      if (state.includes(id)) {
        return [...state.filter((val) => val !== id)];
      }
      return [...state, id];
    });
  };

  const showError = selectedBranches.length === 0 && errorMessage;

  return isEmpty(branches) ? (
    <div className={styles.container}>
      <div className={styles.noBranches}>
        <p>Twoja firma nie posiada jeszcze żadnych oddziałów.</p>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      {branches.map((branch) => (
        <BranchItem
          key={branch.id}
          {...branch}
          onClick={onClick}
          isSelected={selectedBranches.includes(branch.id)}
        />
      ))}
      <div className={styles.message}>
        {showError && <p className={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
}
