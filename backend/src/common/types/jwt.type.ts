export type JWTPayload = {
  userId: string;
};

export type RefreshTokenPayload = {
  userId: string;
  refreshToken: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: { expirationDate: string; token: string };
};

export type AccessToken = {
  accessToken: string;
};
