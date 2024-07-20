import { ReactElement } from 'react';

import { BaseButton, Hr } from '@Components/shared';
import { useGetUserProfile } from '@Data/auth';

import styles from './UserProfile.module.css';

function UserProfile(): ReactElement {
  const { userProfile } = useGetUserProfile();

  const phone = userProfile?.phoneNumber ? userProfile.phoneNumber : ' -';

  return (
    <section className={styles.section}>
      <h3>Mój Profil</h3>
      <div className={styles.data}>
        <p>
          Imię:<span>{userProfile?.firstName}</span>
        </p>
        <p>
          Nazwisko:<span> {userProfile?.lastName}</span>
        </p>
      </div>
      <div className={styles.data}>
        <p>
          Telefon:<span> {phone}</span>
        </p>
        <p>
          Email:<span>{userProfile?.email}</span>
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
