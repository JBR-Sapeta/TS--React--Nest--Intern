import type { ReactElement } from 'react';
import { isNil } from 'ramda';

import { Nullable } from '@Common/types';

import type { FullCompanyData } from '@Data/types';
import { useGetFullOffer } from '@Data/query/offer';

import { FullOffer } from './FullOffer';

type Props = {
  offerId: number;
  company: FullCompanyData;
  isOwner?: boolean;
};

export function WrappedFullOffer({
  company,
  offerId,
  isOwner,
}: Props): Nullable<ReactElement> {
  const { offer } = useGetFullOffer({ companyId: company.id, offerId });

  if (isNil(offer)) return null;

  return <FullOffer company={company} offer={offer} isOwner={isOwner} />;
}
