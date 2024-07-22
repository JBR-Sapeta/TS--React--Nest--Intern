import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isNil } from 'ramda';
import axios, { AxiosError } from 'axios';

import { HttpStatusCode } from '@Common/enums';
import { Nullable } from '@Common/types';

import { QUERY_KEY } from '../../constant';
import { AccessTokenResponse, BaseError } from '../../types';
import { profileDataStorage, tokenDataStorage } from '../../utils';

async function refreshAccessToken(): Promise<Nullable<AccessTokenResponse>> {
  const refreshToken = tokenDataStorage.getRefreshToken();

  if (isNil(refreshToken)) return null;

  const { data } = await axios.post<AccessTokenResponse>(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  return data;
}

type UseGetAccessToken = {
  isPending: boolean;
  accessToken?: string;
  error: Nullable<AxiosError<BaseError>>;
};

export function useGetAccessToken(): UseGetAccessToken {
  const queryClient = useQueryClient();

  const { isPending, data, error } = useQuery<
    Nullable<AccessTokenResponse>,
    AxiosError<BaseError>
  >({
    queryKey: [QUERY_KEY.ACCESS_TOKEN],
    queryFn: async (): Promise<Nullable<AccessTokenResponse>> =>
      refreshAccessToken(),
    refetchInterval: 840000,
    refetchIntervalInBackground: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (
    error?.response?.status === HttpStatusCode.FORBIDDEN ||
    error?.response?.status === HttpStatusCode.UNAUTHORIZED
  ) {
    tokenDataStorage.removeTokens();
    profileDataStorage.removeProfile();
    queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], null);
    queryClient.setQueryData([QUERY_KEY.USER_PROFILE], null);
  }

  if (isNil(data)) {
    return { isPending, accessToken: undefined, error };
  }

  return { isPending, accessToken: data.data.accessToken, error };
}
