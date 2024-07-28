import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNotNil } from 'ramda';

import { convertToQueryParams } from '@Common/functions';
import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { OfferPreviewsResponse, OfferSearchParams } from '../../types';

export async function getOffers(
  params: OfferSearchParams
): Promise<OfferPreviewsResponse> {
  const query = convertToQueryParams(params);

  const { data } = await axios.get<OfferPreviewsResponse>(
    `${import.meta.env.VITE_API_URL}/offers?${query}`
  );

  return data;
}

type UseGetOffersProps = {
  params: OfferSearchParams;
};

type UseGetOffers = {
  isLoading: boolean;
  offers?: OfferPreviewsResponse;
  error: Nullable<Error>;
};

export function useGetOffers({ params }: UseGetOffersProps): UseGetOffers {
  const keys = Object.values(params).filter((val) => isNotNil(val));
  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.OFFERS, ...keys],
    queryFn: async (): Promise<OfferPreviewsResponse> => getOffers(params),
  });

  return {
    isLoading,
    offers: data,
    error,
  };
}
