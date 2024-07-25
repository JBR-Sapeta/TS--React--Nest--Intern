import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { FullOfferData, FullOfferDataResponse } from '../../types';
import { useGetAccessToken } from '../auth';

export async function getFullOffer(
  companyId: string,
  offerId: number,
  accessToken?: string
): Promise<Optional<FullOfferDataResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.get<Optional<FullOfferDataResponse>>(
    `${import.meta.env.VITE_API_URL}/offers/${companyId}/${offerId}/full`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetFullOfferProps = {
  companyId: string;
  offerId: number;
};

type UseGetFullOffer = {
  isLoading: boolean;
  company?: FullOfferData;
  error: Nullable<Error>;
};

export function useGetFullOffer({
  companyId,
  offerId,
}: UseGetFullOfferProps): UseGetFullOffer {
  const { accessToken } = useGetAccessToken();

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.COMPANY_OFFER, offerId],
    queryFn: async (): Promise<Optional<FullOfferDataResponse>> =>
      getFullOffer(companyId, offerId, accessToken),
    refetchOnMount: false,
  });

  return {
    isLoading,
    company: data ? data.data : undefined,
    error,
  };
}
