import { useState } from 'react';
import type { ReactElement } from 'react';
import { FaEnvelope, FaUsers, FaPen, FaTrash } from 'react-icons/fa';
import { FaPhone, FaImage, FaUpload } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';

import { CompanyLogo, MainPhoto, VerifiedLabel } from '@Components/base';
import { DropdownItem, DropdownMenu, Modal } from '@Components/shared';
import type { FullCompanyData } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import { CategoryTags } from '../../category';
import { BranchSection } from '../../branch';
import { DeleteCompoanyForm } from '../DeletCompanyForm/DeletCompanyForm';
import { ResetImagesForm } from '../ResteImagesForm/ResetImagesForm';

import styles from './UserCompany.module.css';

type Props = Omit<FullCompanyData, 'createdAt'>;

const INITIAL_STATE = {
  delete: false,
  resetImages: false,
};

enum ModalType {
  RESET_IMAGES = 'resetImages',
  DELETE = 'delete',
}

export function UserCompany({
  id,
  name,
  size,
  email,
  phoneNumber,
  description,
  logoUrl,
  mainPhotoUrl,
  categories,
  isVerified,
  branches,
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(INITIAL_STATE);

  const openModal = (field: ModalType) => {
    setIsModalOpen((state) => {
      return { ...state, [field]: true };
    });
  };
  const closeModal = () => {
    setIsModalOpen(INITIAL_STATE);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <MainPhoto url={mainPhotoUrl} />
          <div className={styles.companyLogo}>
            <CompanyLogo
              url={logoUrl}
              type="small"
              name={name}
              hasPadding
              hasRadius
            />
            <VerifiedLabel isVerified={isVerified} />
          </div>
          <div className={styles.controls}>
            <DropdownMenu
              LeftIcon={IoMdSettings}
              label="Zarządzaj profilem"
              isBottom
            >
              <DropdownItem path={ROUTER_PATHS.COMPANY_UPDATE} isLink>
                <FaPen />
                Zaktualizuj dane
              </DropdownItem>
              <DropdownItem path={ROUTER_PATHS.COMPANY_UPLOAD} isLink>
                <FaUpload />
                Zaktualizuj zdjęcia
              </DropdownItem>
              <DropdownItem
                onClick={() => openModal(ModalType.RESET_IMAGES)}
                isLink={false}
              >
                <FaImage /> Usuń Zdjęcia
              </DropdownItem>
              <DropdownItem
                onClick={() => openModal(ModalType.DELETE)}
                isLink={false}
              >
                <FaTrash /> Usuń Konto
              </DropdownItem>
            </DropdownMenu>
          </div>
        </div>

        <div className={styles.companyData}>
          <h3>O nas</h3>
          <p>{description}</p>
          <p className={styles.workers}>
            <FaUsers />
            Liczba pracowników - {size}
          </p>
          <CategoryTags categories={categories} className={styles.tags} />
        </div>
        <div className={styles.companyData}>
          <h3>Kontakt</h3>
          <div className={styles.contact}>
            <p>
              <FaEnvelope /> {email}
            </p>
            {phoneNumber && (
              <p>
                <FaPhone /> {phoneNumber}
              </p>
            )}
          </div>
        </div>
        <BranchSection branches={branches} companyId={id} isOwner />
      </div>
      {isModalOpen.delete && (
        <Modal onClick={closeModal}>
          <DeleteCompoanyForm companyId={id} closeModal={closeModal} />
        </Modal>
      )}
      {isModalOpen.resetImages && (
        <Modal onClick={closeModal}>
          <ResetImagesForm companyId={id} closeModal={closeModal} />
        </Modal>
      )}
    </>
  );
}
