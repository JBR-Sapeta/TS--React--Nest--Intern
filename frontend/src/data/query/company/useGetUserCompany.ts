import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'ramda';

import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { FullCompanyData, FullCompanyDataResponse } from '../../types';
import { useGetAccessToken } from '../auth';

export async function getUserCompany(
  userId?: string,
  accessToken?: string
): Promise<Nullable<FullCompanyDataResponse>> {
  if (isNil(accessToken) || isNil(userId)) return null;

  const { data } = await axios.get<FullCompanyDataResponse>(
    `${import.meta.env.VITE_API_URL}/companies/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetUserCompanyProps = {
  userId?: string;
};

type UseGetUserCompany = {
  isLoading: boolean;
  company?: FullCompanyData;
  error: Nullable<Error>;
};

export function useGetUserCompany({
  userId,
}: UseGetUserCompanyProps): UseGetUserCompany {
  const { accessToken } = useGetAccessToken();

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.USER_COMPANY],
    queryFn: async (): Promise<Nullable<FullCompanyDataResponse>> =>
      getUserCompany(userId, accessToken),
    refetchOnMount: false,
    enabled: !!accessToken && !!userId,
  });

  return {
    isLoading,
    company: data ? data.data : undefined,
    error,
  };
}
