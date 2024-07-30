import type { ReactElement } from 'react';
import { MdOutlineTimer, MdOutlineTimerOff } from 'react-icons/md';

import { Nullable } from '@Common/types';
import { CategoryTag, OfferHeader, OfferPreviewHeader } from '@Components/base';
import { CompanyApplicatioList } from '@Containers/application';
import type { FullCompanyData, FullOfferData } from '@Data/types';

import { BranchSection } from '../../branch';

import styles from './FullOffer.module.css';

type Props = {
  company: FullCompanyData;
  offer: FullOfferData;
  isOwner?: boolean;
};

export function FullOffer({
  company,
  offer,
  isOwner = false,
}: Props): Nullable<ReactElement> {
  const { id: companyId, logoUrl, size, name } = company;

  const {
    id: offerId,
    title,
    position,
    operatingModeId,
    employmentTypeId,
    expirationDate,
    removalDate,
    isPaid,
    isActive,
    description,
    categories,
  } = offer;

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <OfferPreviewHeader
          title={title}
          position={position}
          operatingModeId={operatingModeId}
          employmentTypeId={employmentTypeId}
          isPaid={isPaid}
          companyName={name}
          logoUrl={logoUrl}
          size={size}
        />
        <div className={styles.description}>
          <h3>Opis stanowiska</h3>
          <p>{description}</p>
        </div>
        <div className={styles.tags}>
          {categories.map((cat) => (
            <CategoryTag key={cat.id} name={cat.name} />
          ))}
        </div>

        {isOwner && (
          <div className={styles.dates}>
            <p className={styles.dateParagraph}>
              <MdOutlineTimer />
              Oferta wygasa:
              <span> {expirationDate.split('T').at(0)}</span>
            </p>
            <p className={styles.dateParagraph}>
              <MdOutlineTimerOff />
              Data usunięcie:
              <span>{removalDate.split('T').at(0)}</span>
            </p>
            <p className={styles.dateParagraph}>
              Status: <span>{isActive ? 'Aktywna' : 'Nieaktywna'}</span>
            </p>
          </div>
        )}
        <BranchSection branches={offer.branches} companyId={companyId} />
      </section>
      <section>
        <OfferHeader text="Zgłoszenia" isActive />
        <CompanyApplicatioList offerId={offerId} />
      </section>
    </div>
  );
}
