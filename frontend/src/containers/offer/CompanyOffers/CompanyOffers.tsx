import type { ReactElement } from 'react';
import { isNil } from 'ramda';

import { Nullable } from '@Common/types';
import { AddOfferLink, OfferHeader, OfferList } from '@Components/base';
import { OfferPreview } from '@Data/types';
import { useGetCompanyOffers } from '@Data/query/offer';

import styles from './CompanyOffers.module.css';

type Props = {
  companyId: string;
};

export function CompanyOffers({ companyId }: Props): Nullable<ReactElement> {
  const { offers } = useGetCompanyOffers({ companyId });

  if (isNil(offers)) return null;

  const nowTime = new Date().getTime();

  const activeOffers: OfferPreview[] = [];
  const inactiveOffers: OfferPreview[] = [];

  offers.forEach((offer) => {
    const { isActive, expirationDate } = offer;
    const expirationTime = new Date(expirationDate).getTime();

    if (isActive && nowTime < expirationTime) {
      activeOffers.push(offer);
    } else {
      inactiveOffers.push(offer);
    }
  });

  return (
    <section className={styles.section}>
      <div>
        <OfferHeader text="Aktywne Rekrutacje" isActive />
        <AddOfferLink />
        <OfferList companyId={companyId} offers={activeOffers} />
      </div>
      <div>
        <OfferHeader text="Zakończone Rekrutacje" />
        <OfferList companyId={companyId} offers={inactiveOffers} />
      </div>
    </section>
  );
}
