import type { ReactElement } from 'react';
import { isEmpty } from 'ramda';

import { OfferPreview } from '@Data/types';
import { OfferItem } from '../OfferItem/OfferItem';

import styles from './OfferList.module.css';

type Props = {
  companyId: string;
  offers: OfferPreview[];
  isOwner?: boolean;
};

export function OfferList({ companyId, offers, isOwner }: Props): ReactElement {
  return isEmpty(offers) ? (
    <div className={styles.empty}>
      <p>Brak ofert</p>
    </div>
  ) : (
    <div className={styles.container}>
      {offers.map((offer) => (
        <OfferItem
          key={offer.id}
          companyId={companyId}
          offer={offer}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
}
