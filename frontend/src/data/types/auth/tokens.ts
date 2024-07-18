import { ResponseWithData } from '../utils/http-response';

export type TokensResponse = ResponseWithData<Tokens>;
export type Tokens = {
  accessToken: string;
  refreshToken: {
    token: string;
    expirationDate: string;
  };
};

export type AccessTokenResponse = ResponseWithData<AccessToken>;
export type AccessToken = {
  accessToken: string;
};
