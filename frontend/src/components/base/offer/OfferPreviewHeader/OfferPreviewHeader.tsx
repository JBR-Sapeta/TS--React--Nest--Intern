import type { ReactElement } from 'react';
import { LuScrollText } from 'react-icons/lu';
import { BiCoinStack } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';

import { Nullable } from '@Common/types';
import {
  EMPLOYMENT_TYPE_MAP,
  OPERATING_MODE_MAP,
  SALARY_MAP,
} from '@Common/maps';
import { CompanyLogo } from '@Components/base/company';
import { Hr } from '@Components/shared';

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
}: Props): Nullable<ReactElement> {
  return (
    <article className={styles.container}>
      <CompanyLogo type="medium" url={logoUrl} hasPadding hasRadius />
      <div className={styles.data}>
        <div className={styles.header}>
          <h3>{title}</h3>
        </div>
        <div className={styles.baseInfo}>
          <p>
            Stanowisko: <span>{position}</span>
          </p>
          <p>
            Firma: <span>{companyName}</span>
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
