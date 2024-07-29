import type { ReactElement } from 'react';
import { isNil } from 'ramda';

import { Nullable } from '@Common/types';
import { AddOfferLink, OfferHeader, OfferList } from '@Components/base';
import { useGetCompanyOffers } from '@Data/query/offer';

import styles from './CompanyOffers.module.css';

type Props = {
  companyId: string;
};

export function CompanyOffers({ companyId }: Props): Nullable<ReactElement> {
  const { offers } = useGetCompanyOffers({ companyId });

  if (isNil(offers)) return null;

  const activeOffers = offers.filter((offer) => offer.isActive);
  const inactiveOffers = offers.filter((offer) => !offer.isActive);

  return (
    <section className={styles.section}>
      <div>
        <OfferHeader text="Aktywne Rekrutacje" isActive />
        <OfferList companyId={companyId} offers={activeOffers} isOwner />
        <AddOfferLink />
      </div>
      <div>
        <OfferHeader text="Zakończone Rekrutacje" />
        <OfferList companyId={companyId} offers={inactiveOffers} isOwner />
      </div>
    </section>
  );
}
