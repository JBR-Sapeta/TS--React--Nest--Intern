import { isNil } from 'ramda';
import type { ReactElement } from 'react';

import type { Branch } from '@Data/types';
import { useGetFullOffer } from '@Data/query/offer';

import { UpdateOfferForm } from './UpdateOfferForm';

type Props = {
  branches: Branch[];
  companyId: string;
  offerId: number;
};

export function WrappedUpdateOfferForm({
  branches,
  companyId,
  offerId,
}: Props): ReactElement | null {
  const { offer } = useGetFullOffer({ companyId, offerId });

  if (isNil(offer)) return null;

  return (
    <UpdateOfferForm branches={branches} companyId={companyId} offer={offer} />
  );
}
