import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  FaBuilding,
  FaEye,
  FaEyeSlash,
  FaScroll,
  FaTrash,
} from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

import { CompanyLogo } from '@Components/base/company';
import { DropdownItem, DropdownMenu, Modal } from '@Components/shared';
import { UserApplication } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import styles from './ApplicationItem.module.css';
import { ConfirmDeleteApplication } from '../ConfirmDeleteApplication/ConfirmDeleteApplication';

type Props = UserApplication;

export function ApplicationItem({
  id: applicationId,
  isDownloaded,
  offer,
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const {
    id: offerId,
    companyId,
    title,
    position,
    companyName,
    logoUrl,
    isActive,
  } = offer;

  return (
    <article className={styles.article}>
      <CompanyLogo type="medium" url={logoUrl} hasPadding hasRadius />

      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <DropdownMenu
            LeftIcon={IoMdSettings}
            listClassName={styles.dropdownList}
            isBottom
          >
            <DropdownItem path={`${ROUTER_PATHS.OFFERS}/${offerId}`} isLink>
              <FaScroll /> Oferta
            </DropdownItem>
            <DropdownItem
              path={`${ROUTER_PATHS.COMPANIES}/${companyId}`}
              isLink
            >
              <FaBuilding /> Firma
            </DropdownItem>
            <DropdownItem onClick={openModal} isLink={false}>
              <FaTrash /> Usuń
            </DropdownItem>
          </DropdownMenu>
        </div>

        <div className={styles.company}>
          <p className={styles.p}>
            Stanowisko:<span>{position}</span>
          </p>
          <p className={styles.p}>
            Firma:<span>{companyName}</span>
          </p>
        </div>

        <div className={styles.offerStatus}>
          {isActive ? (
            <p className={styles.active}>Nabór w toku</p>
          ) : (
            <p className={styles.inactive}>Wysyłanie zgłoszeń zakończone</p>
          )}
        </div>

        <div className={styles.applicationStatus}>
          {isDownloaded ? (
            <p className={styles.downloaded}>
              <FaEye />
              Pobrano CV
            </p>
          ) : (
            <p className={styles.notDownloaded}>
              <FaEyeSlash />
              Nie pobrano CV
            </p>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal onClick={closeModal}>
          <ConfirmDeleteApplication
            applicationId={applicationId}
            closeModal={closeModal}
          />
          <div>XD</div>
        </Modal>
      )}
    </article>
  );
}
