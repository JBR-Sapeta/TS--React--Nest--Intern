import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil, isNotNil } from 'ramda';

import { convertToQueryParams } from '@Common/functions';
import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  ApplicationsSearchParams,
  OfferApplication,
  OfferApplicationsResponse,
} from '../../types';
import { useGetAccessToken } from '../auth';

async function getOfferApplications(
  offerId: string,
  params: ApplicationsSearchParams,
  accessToken?: string
): Promise<Nullable<OfferApplicationsResponse>> {
  if (isNil(accessToken)) return null;

  const query = convertToQueryParams(params);

  const { data } = await axios.get<OfferApplicationsResponse>(
    `${import.meta.env.VITE_API_URL}/applications/offers/${offerId}?${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetOfferApplicationsProps = {
  offerId: string;
  params: ApplicationsSearchParams;
};

type UseGetOfferApplications = {
  isLoading: boolean;
  applications?: OfferApplication[];
  error: Nullable<Error>;
};

export function useGetOfferApplications({
  offerId,
  params,
}: UseGetOfferApplicationsProps): UseGetOfferApplications {
  const { accessToken } = useGetAccessToken();
  const keys = Object.values(params).filter((val) => isNotNil(val));

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.OFFER_APPLICATIONS, offerId, ...keys],
    queryFn: async (): Promise<Nullable<OfferApplicationsResponse>> =>
      getOfferApplications(offerId, params, accessToken),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    enabled: !!accessToken,
  });

  return {
    isLoading,
    applications: data ? data.data : undefined,
    error,
  };
}
