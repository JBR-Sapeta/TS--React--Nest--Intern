import type { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useVerifyCompany } from '@Data/query/admin';
import { getErrorMessages } from '@Data/utils';

import styles from './VerifyCompanyForm.module.css';

type Props = {
  isVerified: boolean;
  companyId: string;
  closeModal: () => void;
};

export function VerifyCompanyForm({
  isVerified,
  companyId,
  closeModal,
}: Props): ReactElement {
  const { isPending, data, error, verifyCompanyMutation } = useVerifyCompany();

  const onClick = () => {
    verifyCompanyMutation(companyId);
  };

  return (
    <section className={styles.container}>
      <h3>Usuń ofertę</h3>
      <Hr className={styles.hr} />
      <p>
        {isVerified
          ? 'Czy jesteś pewien, że chcesz zweryfikować tę firmę ?'
          : 'Czy jesteś pewien, że chcesz cofnąc weryfikację tej firmy ?'}
        ?
      </p>
      <div className={styles.message}>
        {data && <p className={styles.success}>{data.message}</p>}
        {error && <p className={styles.error}>{getErrorMessages(error)}</p>}
      </div>
      <div className={styles.controls}>
        <BaseButton
          size="medium"
          color={isVerified ? 'red' : 'green'}
          onClick={onClick}
          disabled={isPending || !!data}
        >
          {isVerified ? 'Cofnij' : 'Zweryfikuj'}
        </BaseButton>
        <BaseButton size="medium" color="plain" onClick={closeModal}>
          Zamknij
        </BaseButton>
      </div>
    </section>
  );
}
