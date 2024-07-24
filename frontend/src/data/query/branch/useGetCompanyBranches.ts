import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { Branch, BranchesResponse } from '../../types';

export async function getCompanyBranches(
  companyId: string
): Promise<BranchesResponse> {
  const { data } = await axios.get<BranchesResponse>(
    `${import.meta.env.VITE_API_URL}/branches/${companyId}`
  );

  return data;
}

type UseGetCompanyBranchesProps = {
  companyId: string;
};

type UseGetCompanyBranches = {
  isLoading: boolean;
  company?: Branch[];
  error: Nullable<Error>;
};

export function useGetCompanyBranches({
  companyId,
}: UseGetCompanyBranchesProps): UseGetCompanyBranches {
  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.COMPANIES, companyId],
    queryFn: async (): Promise<BranchesResponse> =>
      getCompanyBranches(companyId),
    refetchOnMount: false,
  });

  return {
    isLoading,
    company: data ? data.data : undefined,
    error,
  };
}
