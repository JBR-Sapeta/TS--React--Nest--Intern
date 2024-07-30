import type { ReactElement } from 'react';
import { FaCalendarAlt, FaPhoneAlt, FaRegEye, FaUser } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa6';
import { MdOutlineFileDownload } from 'react-icons/md';

import { OfferApplication } from '@Data/types';

import { useGetApplicationFile } from '@Data/query/application';
import { BaseButton } from '@Components/shared';

import styles from './CompanyApplicatio.module.css';

type Props = OfferApplication;

export function CompanyApplicatio({
  id,
  user,
  message,
  createdAt,
  isDownloaded,
}: Props): ReactElement {
  const { firstName, lastName, email, phoneNumber } = user;
  const { isPending, getApplicationFile } = useGetApplicationFile({
    applicationId: id,
    fileName: `${firstName}_${lastName}_CV.pdf`,
  });

  return (
    <article className={styles.container}>
      <div className={styles.info}>
        <p>
          <FaUser />
          {`${firstName} ${lastName}`}
        </p>
        <p>
          <FaEnvelope />
          {email}
        </p>
        <p>
          <FaPhoneAlt />
          {phoneNumber || ' -'}
        </p>
        <p>
          <FaCalendarAlt />
          {createdAt.split('T')[0]}
        </p>
      </div>
      <div className={styles.message}>
        <p>{message || '...'}</p>
      </div>
      <div className={styles.controls}>
        <BaseButton
          size="medium"
          color="plain"
          disabled={isPending}
          LeftIcon={MdOutlineFileDownload}
          onClick={() => getApplicationFile(null)}
        >
          Pobierz CV
        </BaseButton>
        <p>
          <FaRegEye /> {isDownloaded ? 'Pobrano' : 'Nie pobrano'}
        </p>
      </div>
    </article>
  );
}
