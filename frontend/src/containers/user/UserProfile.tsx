import { ReactElement } from 'react';
import { isNil } from 'ramda';

import { Nullable } from '@Common/types';
import { BaseButton, Hr } from '@Components/shared';
import { useGetUserProfile } from '@Data/auth';

import styles from './UserProfile.module.css';

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
          Telefon:<span>{phoneNumber || ' -'}</span>
        </p>
        <p>
          Email:<span>{email}</span>
        </p>
      </div>
      <Hr className={styles.hr} />
      <div className={styles.controls}>
        <BaseButton size="medium" color="plain">
          Edutuj
        </BaseButton>
        <BaseButton size="medium" color="plain">
          Zmień hasło
        </BaseButton>
        <BaseButton size="medium" color="plain">
          Zmień email
        </BaseButton>
        <BaseButton size="medium" color="red">
          Zmień email
        </BaseButton>
        <BaseButton size="medium" color="green">
          Nowa firma
        </BaseButton>
      </div>
    </section>
  );
}

export default UserProfile;
