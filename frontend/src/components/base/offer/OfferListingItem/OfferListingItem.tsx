import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { BiCoinStack } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';
import { HiBadgeCheck } from 'react-icons/hi';
import { LuScrollText } from 'react-icons/lu';

import {
  EMPLOYMENT_TYPE_MAP,
  OPERATING_MODE_MAP,
  SALARY_MAP,
} from '@Common/maps';
import { CompanyLogo } from '@Components/base/company';
import { OfferPreview } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import styles from './OfferListingItem.module.css';

type Props = OfferPreview & { hasApplication: boolean };

export function OfferListingItem({
  id,
  title,
  position,
  isPaid,
  employmentTypeId,
  operatingModeId,
  locations,
  company,
  hasApplication,
}: Props): ReactElement {
  const { logoUrl, name } = company;

  return (
    <Link to={`${ROUTER_PATHS.OFFERS}/${id}`}>
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
              Firma: <span>{name}</span>
            </p>
            <p>
              Lokalizacja: <span>{locations.join(',')}</span>
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
        </div>
      </article>
    </Link>
  );
}
