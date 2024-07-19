import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isNil } from 'ramda';
import axios, { AxiosError } from 'axios';

import { HttpStatusCode } from '@Common/enums';
import { Nullable } from '@Common/types';

import { QUERY_KEY } from '../constant';
import { AccessTokenResponse, BaseError } from '../types';
import { profileDataStorage, tokenDataStorage } from '../utils';

import { getTokenExpirationTime } from '../utils/get-token-expiration-time';

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
  accessToken?: string;
};

export function useGetAccessToken(): UseGetAccessToken {
  const queryClient = useQueryClient();
  // @ TO DO Adjust to other hooks
  const { data, error } = useQuery<
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

  // @ TO DO move it to separate hook and call it on top level
  useEffect(() => {
    const tokensRes = tokenDataStorage.getTokens();
    if (tokensRes) {
      const expiresIn = getTokenExpirationTime(tokensRes.data);
      const timeout = setTimeout(() => {
        tokenDataStorage.removeTokens();
        profileDataStorage.removeProfile();
        queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], undefined);
        queryClient.setQueryData([QUERY_KEY.USER_PROFILE], undefined);
      }, expiresIn);

      return () => {
        clearTimeout(timeout);
      };
    }

    return undefined;
  }, [queryClient]);

  if (
    error?.response?.status === HttpStatusCode.FORBIDDEN ||
    error?.response?.status === HttpStatusCode.UNAUTHORIZED
  ) {
    tokenDataStorage.removeTokens();
    profileDataStorage.removeProfile();
    queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], undefined);
    queryClient.setQueryData([QUERY_KEY.USER_PROFILE], undefined);
  }

  if (isNil(data)) {
    return { accessToken: undefined };
  }

  return data.data;
}
