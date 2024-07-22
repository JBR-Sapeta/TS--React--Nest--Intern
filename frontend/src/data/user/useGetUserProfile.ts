import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'ramda';

import type { Nullable } from '@Common/types';
import { profileDataStorage } from '@Data/utils';

import { QUERY_KEY } from '../constant';
import type { UserProfile, UserProfileResponse } from '../types';
import { useGetAccessToken } from '../auth/useGetAccessToken';

export async function getUserProfile(
  accessToken?: string
): Promise<Nullable<UserProfileResponse>> {
  if (isNil(accessToken)) return null;

  const { data } = await axios.get<UserProfileResponse>(
    `${import.meta.env.VITE_API_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

type UseGetUserProfile = {
  isLoading: boolean;
  userProfile?: UserProfile;
  error: Nullable<Error>;
};

export function useGetUserProfile(): UseGetUserProfile {
  const { accessToken } = useGetAccessToken();

  const { isLoading, data, error } = useQuery({
    queryKey: [QUERY_KEY.USER_PROFILE],
    queryFn: async (): Promise<Nullable<UserProfileResponse>> =>
      getUserProfile(accessToken),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    placeholderData: profileDataStorage.getProfile(),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (data) {
      profileDataStorage.saveProfile(data);
    }
  }, [data]);

  return {
    isLoading,
    userProfile: data ? data.data : undefined,
    error,
  };
}
