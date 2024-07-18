import { Tokens } from '../types';

export function getTokenExpirationTime(tokens: Tokens): number {
  const now = new Date().getTime();
  const expirationDate = new Date(tokens.refreshToken.expirationDate).getTime();
  return expirationDate - now;
}
