import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil, isNotNil } from 'ramda';

import { convertToQueryParams } from '@Common/functions';
import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type {
  AdminCompanySearchParams,
  CompanyAdminPrewievsResponse,
  CompanyAdminPrewiev,
} from '../../types';
import { useGetAccessToken } from '../auth';

export async function getCompanies(
  params: AdminCompanySearchParams,
  accessToken?: string
): Promise<Nullable<CompanyAdminPrewievsResponse>> {
  if (isNil(accessToken)) return null;

  const query = convertToQueryParams(params);

  const { data } = await axios.get<CompanyAdminPrewievsResponse>(
    `${import.meta.env.VITE_API_URL}/admin/companies?${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetCompaniesProps = {
  params: AdminCompanySearchParams;
};

type UseGetCompanies = {
  isLoading: boolean;
  companies?: CompanyAdminPrewiev[];
  totalPages: number;
  currentPage: number;
  error: Nullable<Error>;
};

export function useGetCompanies({
  params,
}: UseGetCompaniesProps): UseGetCompanies {
  const { accessToken } = useGetAccessToken();
  const keys = Object.values(params).filter((val) => isNotNil(val));

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.ADMIN_COMPANIES, ...keys],
    queryFn: async (): Promise<Nullable<CompanyAdminPrewievsResponse>> =>
      getCompanies(params, accessToken),
    placeholderData: keepPreviousData,
    enabled: !!accessToken,
  });

  return {
    isLoading,
    companies: data ? data.data : undefined,
    currentPage: data ? data.pageNumber : 0,
    totalPages: data ? data.totalPages : 1,
    error,
  };
}
