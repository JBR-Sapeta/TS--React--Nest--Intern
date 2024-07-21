import { useState } from 'react';
import type { ReactElement } from 'react';

import { BaseButton, Modal } from '@Components/shared';
import { UserProfile } from '@Data/types';

import UpdateEamilForm from '../UpdateEmailForm/UpdateEmailForm';
import UpdateProfilForm from '../UpdateProfileForm/UpdateProfileForm';
import UpdatePasswordForm from '../UpdatePasswordForm/UpdatePasswordForm';
import DeleteProfileForm from '../DeleteProfileForm/DeleteProfileForm';

import styles from './ProfileControls.module.css';

const INITIAL_STATE = {
  informations: false,
  password: false,
  email: false,
  delete: false,
  company: false,
};

enum ModalType {
  INFO = 'informations',
  PASSWORD = 'password',
  EMAIL = 'email',
  DELETE = 'delete',
  COMPANY = 'company',
}

type Props = {
  userProfile: UserProfile;
};

function ProfileControls({ userProfile }: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(INITIAL_STATE);

  const openModal = (field: ModalType) => {
    setIsModalOpen((state) => {
      return { ...state, [field]: true };
    });
  };
  const closeModal = () => {
    setIsModalOpen(INITIAL_STATE);
  };

  const { firstName, lastName, phoneNumber } = userProfile;

  return (
    <>
      <div className={styles.controls}>
        <BaseButton
          size="medium"
          color="plain"
          onClick={() => openModal(ModalType.INFO)}
        >
          Edutuj
        </BaseButton>
        <BaseButton
          size="medium"
          color="plain"
          onClick={() => openModal(ModalType.PASSWORD)}
        >
          Zmień hasło
        </BaseButton>
        <BaseButton
          size="medium"
          color="plain"
          onClick={() => openModal(ModalType.EMAIL)}
        >
          Zmień email
        </BaseButton>
        <BaseButton
          size="medium"
          color="red"
          onClick={() => openModal(ModalType.DELETE)}
        >
          Usuń konto
        </BaseButton>
        <BaseButton
          size="medium"
          color="green"
          onClick={() => openModal(ModalType.COMPANY)}
        >
          Nowa firma
        </BaseButton>
      </div>
      {isModalOpen.informations && (
        <Modal onClick={closeModal}>
          <UpdateProfilForm
            firstName={firstName}
            lastName={lastName}
            phoneNumber={phoneNumber}
            closeModal={closeModal}
          />
        </Modal>
      )}
      {isModalOpen.password && (
        <Modal onClick={closeModal}>
          <UpdatePasswordForm closeModal={closeModal} />
        </Modal>
      )}
      {isModalOpen.email && (
        <Modal onClick={closeModal}>
          <UpdateEamilForm closeModal={closeModal} />
        </Modal>
      )}
      {isModalOpen.delete && (
        <Modal onClick={closeModal}>
          <DeleteProfileForm closeModal={closeModal} />
        </Modal>
      )}
      {isModalOpen.company && (
        <Modal onClick={closeModal}>
          <DeleteProfileForm closeModal={closeModal} />
        </Modal>
      )}
    </>
  );
}

export default ProfileControls;
