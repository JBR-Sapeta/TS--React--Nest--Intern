import type { ReactElement } from 'react';
import { FaEnvelope, FaUsers, FaPen, FaTrash } from 'react-icons/fa';
import { FaPhone, FaImage } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';

import { isNil } from 'ramda';

import type { Nullable } from '@Common/types';
import { CompanyLogo, MainPhoto, VerifiedLabel } from '@Components/base';
import { DropdownItem, DropdownMenu } from '@Components/shared';
import { useGetUserCompany } from '@Data/query/company';

import { CategoryTags } from '../../category';

import styles from './UserCompany.module.css';

type Props = {
  userId: string;
};

export function UserCompany({ userId }: Props): Nullable<ReactElement> {
  const { company } = useGetUserCompany({ userId });

  if (isNil(company)) return null;

  const {
    name,
    logoUrl,
    mainPhotoUrl,
    description,
    size,
    categories,
    email,
    phoneNumber,
    isVerified,
  } = company;

  return (
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
            <DropdownItem path="/profile" isLink>
              <FaPen />
              Zaktualizuj dane
            </DropdownItem>
            <DropdownItem path="/company" isLink>
              <FaImage />
              Zakyualizuj zdjęcia
            </DropdownItem>
            <DropdownItem onClick={() => {}} isLink={false}>
              <FaTrash /> Usuń Konto
            </DropdownItem>
          </DropdownMenu>
        </div>
      </div>

      <div className={styles.content}>
        <h3>O nas</h3>
        <p>{description}</p>
        <p className={styles.workers}>
          <FaUsers />
          Liczba pracowników - {size}
        </p>
        <CategoryTags categories={categories} className={styles.tags} />
      </div>
      <div className={styles.content}>
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
    </div>
  );
}
