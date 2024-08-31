import type { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useBanUser } from '@Data/query/admin';
import { getErrorMessages } from '@Data/utils';

import styles from './ConfirmBan.module.css';

type Props = {
  hasBan: boolean;
  userId: string;
  closeModal: () => void;
};

export function ConfirmBan({
  hasBan,
  userId,
  closeModal,
}: Props): ReactElement {
  const { isPending, data, error, banUserMutation } = useBanUser();

  const onClick = () => {
    banUserMutation(userId);
  };

  return (
    <section className={styles.container}>
      <h3>Blokada użytkownika</h3>
      <Hr className={styles.hr} />
      <p>
        {hasBan
          ? 'Czy jesteś pewien, że chcesz odblokować tego uzytkownika?'
          : 'Czy jesteś pewien, że chcesz zablokować tego uzytkownika ?'}
        ?
      </p>
      <div className={styles.message}>
        {data && <p className={styles.success}>{data.message}</p>}
        {error && <p className={styles.error}>{getErrorMessages(error)}</p>}
      </div>
      <div className={styles.controls}>
        <BaseButton
          size="medium"
          color={hasBan ? 'red' : 'green'}
          onClick={onClick}
          disabled={isPending || !!data}
        >
          {hasBan ? 'Odblokuj' : 'Zablokuj'}
        </BaseButton>
        <BaseButton size="medium" color="plain" onClick={closeModal}>
          Zamknij
        </BaseButton>
      </div>
    </section>
  );
}
