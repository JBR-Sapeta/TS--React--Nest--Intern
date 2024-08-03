import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNotEmpty } from 'ramda';

import type { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { OfferData, OfferDataResponse } from '../../types';

export async function getOffer(
  companyId: string,
  offerId: string
): Promise<Optional<OfferDataResponse>> {
  const { data } = await axios.get<Optional<OfferDataResponse>>(
    `${import.meta.env.VITE_API_URL}/offers/${companyId}/${offerId}/partial`
  );

  return data;
}

type UseGetOfferProps = {
  companyId: string;
  offerId: string;
};

type UseGetOffer = {
  isLoading: boolean;
  offer?: OfferData;
  error: Nullable<Error>;
};

export function useGetOffer({
  companyId,
  offerId,
}: UseGetOfferProps): UseGetOffer {
  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.OFFER, offerId],
    queryFn: async (): Promise<Optional<OfferDataResponse>> =>
      getOffer(companyId, offerId),
    refetchOnMount: false,
    enabled: isNotEmpty(offerId) && isNotEmpty(companyId),
  });

  return {
    isLoading,
    offer: data ? data.data : undefined,
    error,
  };
}
