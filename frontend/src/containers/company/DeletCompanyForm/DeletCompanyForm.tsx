import type { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useDeleteCompany } from '@Data/query/company';

import styles from './DeletCompanyForm.module.css';

type Props = {
  companyId: string;
  closeModal: () => void;
};

export function DeleteCompoanyForm({
  companyId,
  closeModal,
}: Props): ReactElement {
  const { deleteCompanyMutation } = useDeleteCompany();

  const onClick = () => {
    deleteCompanyMutation(companyId);
  };

  return (
    <div className={styles.container}>
      <h3>Usuń konto</h3>
      <Hr className={styles.hr} />
      <p>
        Usunięcie konta f irmowego spowoduje usunięcie wszytskich ofert oraz
        zgłoszeń kandydatów. Czy jesteś pewien, że chcesz usunąć konto firmowe ?
      </p>
      <div className={styles.controls}>
        <BaseButton size="medium" color="red" onClick={onClick}>
          Usuń
        </BaseButton>
        <BaseButton size="medium" color="plain" onClick={closeModal}>
          Cofnij
        </BaseButton>
      </div>
    </div>
  );
}
