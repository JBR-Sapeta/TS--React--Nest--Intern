import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'ramda';

import type { Nullable, Optional } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import type { CompanyOffersResponse, OfferPreview } from '../../types';
import { useGetAccessToken } from '../auth';

export async function getCompanyOffers(
  companyId: string,
  accessToken?: string
): Promise<Optional<CompanyOffersResponse>> {
  if (isNil(accessToken)) {
    return undefined;
  }

  const { data } = await axios.get<CompanyOffersResponse>(
    `${import.meta.env.VITE_API_URL}/offers/${companyId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetCompanyOffersProps = {
  companyId: string;
};

type UseGetCompanyOffers = {
  isLoading: boolean;
  offers?: OfferPreview[];
  error: Nullable<Error>;
};

export function useGetCompanyOffers({
  companyId,
}: UseGetCompanyOffersProps): UseGetCompanyOffers {
  const { accessToken } = useGetAccessToken();

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.COMPANY_OFFERS],
    queryFn: async (): Promise<Optional<CompanyOffersResponse>> =>
      getCompanyOffers(companyId, accessToken),
  });

  return {
    isLoading,
    offers: data?.data,
    error,
  };
}
