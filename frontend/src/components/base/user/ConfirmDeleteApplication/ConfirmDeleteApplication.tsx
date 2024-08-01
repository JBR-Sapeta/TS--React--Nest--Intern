import type { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useDeleteApplication } from '@Data/query/application';
import { getErrorMessages } from '@Data/utils';

import styles from './ConfirmDeleteApplication.module.css';

type Props = {
  applicationId: number;
  closeModal: () => void;
};

export function ConfirmDeleteApplication({
  applicationId,
  closeModal,
}: Props): ReactElement {
  const { isPending, data, error, deleteApplicationMutation } =
    useDeleteApplication();

  const onClick = () => {
    deleteApplicationMutation(applicationId);
  };

  return (
    <section className={styles.container}>
      <h3>Usuń ofertę</h3>
      <Hr className={styles.hr} />
      <p>
        Czy jesteś pewien, że chcesz usunąc swoją aplikacje na to stanowisko ?
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
