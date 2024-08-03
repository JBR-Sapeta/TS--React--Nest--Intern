import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { CompanyData, CompanyDataResponse } from '../../types';

export async function getCompanyBySlug(
  slug: string
): Promise<CompanyDataResponse> {
  const { data } = await axios.get<CompanyDataResponse>(
    `${import.meta.env.VITE_API_URL}/companies/${slug}`
  );

  return data;
}

type UseGetCompanyBySlugProps = {
  slug: string;
  isValid: boolean;
};

type UseGetCompanyBySlug = {
  isLoading: boolean;
  company?: CompanyData;
  error: Nullable<Error>;
};

export function useGetCompanyBySlug({
  slug,
  isValid,
}: UseGetCompanyBySlugProps): UseGetCompanyBySlug {
  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.COMPANY, slug],
    queryFn: async (): Promise<CompanyDataResponse> => getCompanyBySlug(slug),
    refetchOnMount: false,
    enabled: isValid,
  });

  return {
    isLoading,
    company: data ? data.data : undefined,
    error,
  };
}
