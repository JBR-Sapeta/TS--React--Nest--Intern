import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from '@Data/constant';
import { UserProfile } from '@Data/types';

import {
  getTokenExpirationTime,
  profileDataStorage,
  tokenDataStorage,
} from '../../utils';

export function useStorageSynchronize(userProfile?: UserProfile) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const tokensRes = tokenDataStorage.getTokens();
    if (tokensRes && userProfile) {
      const expiresIn = getTokenExpirationTime(tokensRes.data);
      const timeout = setTimeout(() => {
        tokenDataStorage.removeTokens();
        profileDataStorage.removeProfile();
        queryClient.setQueryData([QUERY_KEY.ACCESS_TOKEN], null);
        queryClient.setQueryData([QUERY_KEY.USER_PROFILE], null);
      }, expiresIn);

      return () => {
        clearTimeout(timeout);
      };
    }

    return undefined;
  }, [userProfile, queryClient]);
}
