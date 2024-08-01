import { useState } from 'react';
import type { ReactElement } from 'react';
import { FaCalendarAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

import { BaseButton, Modal, StatusIndicator } from '@Components/shared';
import { UserAdminPreview } from '@Data/types';

import styles from './UserPreview.module.css';
import { ConfirmBan } from '../ConfirmBan/ConfirmBan';

type Props = UserAdminPreview;

export function UserPreview({
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
  createdAt,
  hasBan,
  isActive,
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [date, time] = createdAt.split('T');
  return (
    <article className={styles.article}>
      <div className={styles.dataContainer}>
        <h3 className={styles.h3}>{`${firstName} ${lastName}`}</h3>

        <StatusIndicator
          isActive={isActive && !hasBan}
          activLabel="Aktywny"
          inactiveLable={hasBan ? 'Zablokowany' : 'Nieaktywny'}
          hasColors
        />
        <p className={styles.p}>
          <FaEnvelope /> Telefon:<span>{phoneNumber || ' -'}</span>
        </p>
        <p className={styles.p}>
          <FaPhoneAlt /> Email:<span>{email}</span>
        </p>
        <p className={styles.p}>
          <FaCalendarAlt /> Rejestracja:
          <span>{`${date} - ${time.split('.')[0]}`}</span>
        </p>
      </div>
      <div className={styles.button}>
        <BaseButton size="medium" color="plain" onClick={openModal}>
          {hasBan ? 'Odblokuj' : 'Zablokuj'}
        </BaseButton>
      </div>
      {isModalOpen && (
        <Modal onClick={closeModal}>
          <ConfirmBan userId={id} hasBan={hasBan} closeModal={closeModal} />
        </Modal>
      )}
    </article>
  );
}
