import { ReactElement } from 'react';
import { isNil } from 'ramda';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

import { Nullable } from '@Common/types';
import { Hr } from '@Components/shared';
import { useGetUserProfile } from '@Data/user';

import styles from './UserProfile.module.css';
import ProfileControls from '../ProfileControls/ProfileControls';

function UserProfile(): Nullable<ReactElement> {
  const { userProfile } = useGetUserProfile();

  if (isNil(userProfile)) {
    return null;
  }

  const { firstName, lastName, phoneNumber, email } = userProfile;

  return (
    <section className={styles.section}>
      <h3>Mój Profil</h3>
      <div className={styles.data}>
        <p>
          Imię:<span>{firstName}</span>
        </p>
        <p>
          Nazwisko:<span> {lastName}</span>
        </p>
      </div>
      <div className={styles.data}>
        <p>
          <FaPhoneAlt /> Telefon:<span>{phoneNumber || ' -'}</span>
        </p>
        <p>
          <MdEmail /> Email:<span>{email}</span>
        </p>
      </div>
      <Hr className={styles.hr} />
      <ProfileControls userProfile={userProfile} />
    </section>
  );
}

export default UserProfile;
