export function calculateDate(timeInMS: number): Date {
  const now = new Date().getTime();
  return new Date(now + timeInMS);
}
