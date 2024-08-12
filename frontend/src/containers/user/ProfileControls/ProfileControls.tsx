import { useState } from 'react';
import type { ReactElement } from 'react';

import { UserRole } from '@Common/enums';
import { hasRoles } from '@Common/functions';
import { BaseButton, BaseLink, Modal } from '@Components/shared';
import type { UserProfile } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

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
};

enum ModalType {
  INFO = 'informations',
  PASSWORD = 'password',
  EMAIL = 'email',
  DELETE = 'delete',
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

  const { firstName, lastName, phoneNumber, roles } = userProfile;

  const showCompanyButton = hasRoles(roles, [UserRole.USER]);

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
        {showCompanyButton && (
          <BaseLink
            size="medium"
            color="green"
            path={ROUTER_PATHS.USER_CREATE_COMPANY}
          >
            Konto firmowe
          </BaseLink>
        )}
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
    </>
  );
}

export default ProfileControls;
