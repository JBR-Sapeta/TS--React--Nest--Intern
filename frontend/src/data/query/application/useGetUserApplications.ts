import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'ramda';

import { convertToQueryParams } from '@Common/functions';
import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  ApplicationsSearchParams,
  OfferApplication,
  OfferApplicationsResponse,
} from '../../types';
import { useGetAccessToken } from '../auth';

export async function getUserApplications(
  userId: string,
  params: ApplicationsSearchParams,
  accessToken?: string
): Promise<Nullable<OfferApplicationsResponse>> {
  if (isNil(accessToken)) return null;

  const query = convertToQueryParams(params);

  const { data } = await axios.get<OfferApplicationsResponse>(
    `${import.meta.env.VITE_API_URL}/applications/users/${userId}?${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetUserApplicationsProps = {
  userId: string;
  params: ApplicationsSearchParams;
};

type UseGetUserApplications = {
  isLoading: boolean;
  applications?: OfferApplication[];
  error: Nullable<Error>;
};

export function useGetUserApplications({
  userId,
  params,
}: UseGetUserApplicationsProps): UseGetUserApplications {
  const { accessToken } = useGetAccessToken();
  const keys = Object.values(params);

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.USER_APPLICATIONS, ...keys],
    queryFn: async (): Promise<Nullable<OfferApplicationsResponse>> =>
      getUserApplications(userId, params, accessToken),
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
