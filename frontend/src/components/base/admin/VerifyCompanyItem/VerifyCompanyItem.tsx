import { useState } from 'react';
import type { ReactElement } from 'react';
import { FaPen, FaEnvelope, FaPhoneAlt, FaUserAlt } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

import { CompanyLogo } from '@Components/base/company';
import {
  DropdownItem,
  DropdownMenu,
  Hr,
  Modal,
  StatusIndicator,
} from '@Components/shared';
import { VerifyCompanyForm } from '@Containers/admin';
import { CompanyAdminPrewiev } from '@Data/types';

import styles from './VerifyCompanyItem.module.css';

type Props = CompanyAdminPrewiev;

export function VerifyCompanyItem({
  id,
  name,
  logoUrl,
  isVerified,
  email,
  owner,
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <article className={styles.article}>
      <CompanyLogo type="medium" url={logoUrl} hasPadding hasRadius />

      <div className={styles.dataContainer}>
        <div className={styles.header}>
          <h3>{name}</h3>
          <DropdownMenu
            LeftIcon={IoMdSettings}
            listClassName={styles.dropdownList}
            isBottom
          >
            <DropdownItem onClick={openModal} isLink={false}>
              <FaPen /> {isVerified ? 'Cofnij weryfikację' : 'Zweryfikuj'}
            </DropdownItem>
          </DropdownMenu>
        </div>

        <div className={styles.contact}>
          <StatusIndicator
            isActive={isVerified}
            activLabel="Zweryfikowana"
            inactiveLable="Status:  Nie zweryfikowana"
            hasColors
          />
          <p className={styles.p}>
            <FaEnvelope /> Telefon:<span>{' -'}</span>
          </p>
          <p className={styles.p}>
            <FaPhoneAlt /> Email:<span>{email}</span>
          </p>
        </div>
        <Hr className={styles.hr} />
        <div className={styles.owner}>
          {owner && (
            <>
              <p className={styles.p}>
                <FaUserAlt />
                Użytkownik:<span>{`${owner.firstName} ${owner.lastName}`}</span>
              </p>
              <p className={styles.p}>
                <FaEnvelope /> Emial:<span>{owner.email}</span>
              </p>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal onClick={closeModal}>
          <VerifyCompanyForm
            companyId={id}
            closeModal={closeModal}
            isVerified={isVerified}
          />
        </Modal>
      )}
    </article>
  );
}
