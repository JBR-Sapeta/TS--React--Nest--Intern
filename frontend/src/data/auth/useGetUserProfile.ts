import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'ramda';

import { Nullable, Nullish } from '@Common/types';
import { profileDataStorage } from '@Data/utils';

import { QUERY_KEY } from '../constant';
import type {
  ResponseWithData,
  UserProfile,
  UserProfileResponse,
} from '../types';
import { useGetAccessToken } from './useGetAccessToken';

export async function getUserProfile(
  accessToken: Nullish<string>
): Promise<Nullable<UserProfileResponse>> {
  if (isNil(accessToken)) return null;

  const { data } = await axios.get<ResponseWithData<UserProfile>>(
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
  userProfile?: UserProfile;
  error: Nullable<Error>;
  isLoading: boolean;
};

export function useGetUserProfile(): UseGetUserProfile {
  const { accessToken } = useGetAccessToken();

  const { data, error, isLoading } = useQuery({
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
    userProfile: data?.data,
    error,
    isLoading,
  };
}
