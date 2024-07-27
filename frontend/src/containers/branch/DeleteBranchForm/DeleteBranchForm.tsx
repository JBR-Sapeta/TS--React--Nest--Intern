import type { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useDeleteBranch } from '@Data/query/branch';
import { getErrorMessages } from '@Data/utils';

import styles from './DeleteBranchForm.module.css';

type Props = {
  branchId: number;
  companyId: string;
  closeModal: () => void;
};

export function DeleteBranchForm({
  branchId,
  companyId,
  closeModal,
}: Props): ReactElement {
  const { isPending, data, error, deleteBranchMutation } = useDeleteBranch();

  const onClick = () => {
    deleteBranchMutation({ branchId, companyId });
  };

  return (
    <section className={styles.container}>
      <h3>Usuń oddział</h3>
      <Hr className={styles.hr} />
      <p>
        Oddział firmy nie może być powiązany z żadną istniejącą ofertą. Przed
        usunięciem zaktualizuj oferty.
      </p>
      <div className={styles.message}>
        {data && <p className={styles.success}>{data.message}</p>}
        {error && <p className={styles.error}>{getErrorMessages(error)}</p>}
      </div>
      <div className={styles.controls}>
        <BaseButton
          size="medium"
          color="red"
          onClick={onClick}
          disabled={isPending || !!data}
        >
          Usuń
        </BaseButton>
        <BaseButton size="medium" color="plain" onClick={closeModal}>
          Zamknij
        </BaseButton>
      </div>
    </section>
  );
}
