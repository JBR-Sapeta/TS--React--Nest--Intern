import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { LuScrollText } from 'react-icons/lu';
import { BiCoinStack } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';
import { HiBadgeCheck } from 'react-icons/hi';

import { Nullable } from '@Common/types';
import {
  EMPLOYMENT_TYPE_MAP,
  OPERATING_MODE_MAP,
  SALARY_MAP,
} from '@Common/maps';
import { CompanyLogo } from '@Components/base/company';
import { Hr } from '@Components/shared';
import { ROUTER_PATHS } from '@Router/constants';

import styles from './OfferPreviewHeader.module.css';

type Props = {
  title: string;
  position: string;
  companyName: string;
  logoUrl: Nullable<string>;
  employmentTypeId: number;
  operatingModeId: number;
  size: number;
  isPaid: boolean;
  hasApplication?: boolean;
  slug?: string;
};

export function OfferPreviewHeader({
  title,
  position,
  companyName,
  logoUrl,
  employmentTypeId,
  operatingModeId,
  size,
  isPaid,
  hasApplication = false,
  slug,
}: Props): Nullable<ReactElement> {
  return (
    <article className={styles.container}>
      <CompanyLogo type="medium" url={logoUrl} hasPadding hasRadius />
      <div className={styles.data}>
        <div className={styles.header}>
          <h3>{title}</h3>
          {hasApplication && <HiBadgeCheck />}
        </div>
        <div className={styles.baseInfo}>
          <p>
            Stanowisko: <span>{position}</span>
          </p>
          <p>
            Firma:
            {slug ? (
              <Link
                to={`${ROUTER_PATHS.COMPANIES}/${slug}`}
                className={styles.companyLink}
              >
                {companyName}
              </Link>
            ) : (
              <span>{companyName}</span>
            )}
          </p>
          <p>
            Liczba pracowników: <span>~ {size}</span>
          </p>
        </div>
        <div className={styles.otherInfo}>
          <p className={styles.p}>
            <LuScrollText />
            {EMPLOYMENT_TYPE_MAP.get(employmentTypeId)}
          </p>
          <p className={styles.p}>
            <BiCoinStack />
            {SALARY_MAP.get(isPaid)}
          </p>
          <p className={styles.p}>
            <BsBriefcase /> {OPERATING_MODE_MAP.get(operatingModeId)}
          </p>
        </div>
        <Hr className={styles.hr} />
      </div>
    </article>
  );
}
