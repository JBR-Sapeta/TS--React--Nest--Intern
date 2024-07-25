import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { convertToQueryParams } from '@Common/functions';
import type { Nullable } from '@Common/types';

import { isNotNil } from 'ramda';
import { QUERY_KEY } from '../../constant';
import type { CompanySearchParams, CompaniesResponse } from '../../types';

export async function getCompanies(
  params: CompanySearchParams
): Promise<CompaniesResponse> {
  const query = convertToQueryParams(params);

  const { data } = await axios.get<CompaniesResponse>(
    `${import.meta.env.VITE_API_URL}/companies?${query}}`
  );

  return data;
}

type UseGetCompaniesProps = {
  params: CompanySearchParams;
};

type UseGetCompanies = {
  isLoading: boolean;
  company?: CompaniesResponse;
  error: Nullable<Error>;
};

export function useGetCompanies({
  params,
}: UseGetCompaniesProps): UseGetCompanies {
  const keys = Object.values(params).filter((val) => isNotNil(val));
  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.COMPANIES, ...keys],
    queryFn: async (): Promise<CompaniesResponse> => getCompanies(params),
  });

  return {
    isLoading,
    company: data,
    error,
  };
}
