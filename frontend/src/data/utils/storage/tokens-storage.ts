import secureLocalStorage from 'react-secure-storage';

import type { Nullable } from '@Common/types';

import type { TokensResponse } from '../../types';
import { getTokenExpirationTime } from '../get-token-expiration-time';

const TOKENS_LOCAL_STORAGE_KEY = 'TOKENS_DATA';
const FIFTEEN_MINUTS_IN_MS = 900000;

function saveTokens(response: TokensResponse): void {
  secureLocalStorage.setItem(TOKENS_LOCAL_STORAGE_KEY, response);
}

function removeTokens(): void {
  secureLocalStorage.removeItem(TOKENS_LOCAL_STORAGE_KEY);
}

function getTokens(): Nullable<TokensResponse> {
  const response = secureLocalStorage.getItem(
    TOKENS_LOCAL_STORAGE_KEY
  ) as Nullable<TokensResponse>;

  if (response) {
    const remainingTime = getTokenExpirationTime(response.data);
    if (remainingTime <= FIFTEEN_MINUTS_IN_MS) {
      removeTokens();
      return null;
    }
    return response;
  }
  return null;
}

function getRefreshToken(): Nullable<string> {
  const response = secureLocalStorage.getItem(
    TOKENS_LOCAL_STORAGE_KEY
  ) as Nullable<TokensResponse>;

  if (response) {
    const remainingTime = getTokenExpirationTime(response.data);
    if (remainingTime <= FIFTEEN_MINUTS_IN_MS) {
      removeTokens();
      return null;
    }

    return response.data.refreshToken.token;
  }
  return null;
}

export const tokenDataStorage = {
  saveTokens,
  removeTokens,
  getTokens,
  getRefreshToken,
};
