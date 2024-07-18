import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isNil } from 'ramda';

import { Nullable, Nullish } from '@Common/types';

import { QUERY_KEY } from '../constant';
import type {
  ResponseWithData,
  UserProfile,
  UserProfileResponse,
} from '../types';

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

export function useGetUserProfile(
  accessToken: Nullish<string>
): UseGetUserProfile {
  const { data, error, isLoading } = useQuery({
    queryKey: [QUERY_KEY.USER_PROFILE],
    queryFn: async (): Promise<Nullable<UserProfileResponse>> =>
      getUserProfile(accessToken),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!accessToken,
  });

  return {
    userProfile: data?.data,
    error,
    isLoading,
  };
}
