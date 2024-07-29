import type { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useDeleteOffer } from '@Data/query/offer';
import { getErrorMessages } from '@Data/utils';

import styles from './DeleteOfferForm.module.css';

type Props = {
  offerId: number;
  companyId: string;
  closeModal: () => void;
};

export function DeleteOfferForm({
  offerId,
  companyId,
  closeModal,
}: Props): ReactElement {
  const { isPending, data, error, deleteOfferMutation } = useDeleteOffer({
    offerId,
    companyId,
  });

  const onClick = () => {
    deleteOfferMutation(null);
  };

  return (
    <section className={styles.container}>
      <h3>Usuń ofertę</h3>
      <Hr className={styles.hr} />
      <p>
        Usunięcie oferty spowoduje usuniecie wszytskich zgłoszeń kandydatów. Czy
        jesteś pewien, że chcesz usunąć ofertę ?
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
