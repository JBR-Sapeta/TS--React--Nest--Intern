import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { FullCompanyData, FullCompanyDataResponse } from '../../types';

export async function getUserCompany(
  userId: string
): Promise<FullCompanyDataResponse> {
  const { data } = await axios.get<FullCompanyDataResponse>(
    `${import.meta.env.VITE_API_URL}/companies/users/${userId}`
  );

  return data;
}

type UseGetUserCompanyProps = {
  userId: string;
};

type UseGetUserCompany = {
  isLoading: boolean;
  company?: FullCompanyData;
  error: Nullable<Error>;
};

export function useGetUserCompany({
  userId,
}: UseGetUserCompanyProps): UseGetUserCompany {
  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.USER_COMPANY],
    queryFn: async (): Promise<FullCompanyDataResponse> =>
      getUserCompany(userId),
    refetchOnMount: false,
  });

  return {
    isLoading,
    company: data ? data.data : undefined,
    error,
  };
}
