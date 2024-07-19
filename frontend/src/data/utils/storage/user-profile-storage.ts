import secureLocalStorage from 'react-secure-storage';

import type { Nullable } from '@Common/types';

import type { UserProfileResponse } from '../../types';

const PROFILE_LOCAL_STORAGE_KEY = 'PROFILE_DATA';

function saveProfile(response: UserProfileResponse): void {
  secureLocalStorage.setItem(PROFILE_LOCAL_STORAGE_KEY, response);
}

function removeProfile(): void {
  secureLocalStorage.removeItem(PROFILE_LOCAL_STORAGE_KEY);
}

function getProfile(): Nullable<UserProfileResponse> {
  const response = secureLocalStorage.getItem(
    PROFILE_LOCAL_STORAGE_KEY
  ) as Nullable<UserProfileResponse>;

  return response;
}

export const profileDataStorage = {
  saveProfile,
  removeProfile,
  getProfile,
};
