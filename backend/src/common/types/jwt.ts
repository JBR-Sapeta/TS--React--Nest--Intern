export type JWTPayload = {
  userId: string;
};

export type RefreshTokenPayload = {
  userId: string;
  refreshToken: string;
};
