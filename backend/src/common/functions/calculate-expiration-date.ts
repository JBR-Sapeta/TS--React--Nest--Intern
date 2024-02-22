export function calculateExpirationDate(expirationTime: number): Date {
  const now = new Date().getTime();
  return new Date(now + expirationTime);
}
