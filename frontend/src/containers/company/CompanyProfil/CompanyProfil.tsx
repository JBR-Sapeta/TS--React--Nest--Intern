import type { ReactElement } from 'react';
import { FaEnvelope, FaUsers } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';

import { CompanyLogo, MainPhoto, VerifiedLabel } from '@Components/base';
import type { CompanyData } from '@Data/types';
import { useGetCompanyBranches } from '@Data/query/branch';

import { CategoryTags } from '../../category';
import { BranchSection } from '../../branch';

import styles from './CompanyProfil.module.css';

type Props = Omit<CompanyData, 'createdAt'>;

export function CompanyProfil({
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
}: Props): ReactElement {
  const { branches } = useGetCompanyBranches({ companyId: id });

  return (
    <section className={styles.container}>
      <div className={styles.headerContainer}>
        <MainPhoto url={mainPhotoUrl} />
        <div className={styles.companyLogo}>
          <CompanyLogo
            url={logoUrl}
            type="small"
            name={name}
            hasPadding
            hasRadius
            hasWhiteBackground
          />
          <VerifiedLabel isVerified={isVerified} />
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
      <div>
        {branches && <BranchSection branches={branches} companyId={id} />}
      </div>

      {/* @TO DO  add company offers */}
    </section>
  );
}
