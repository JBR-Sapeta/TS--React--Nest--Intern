export function transformDate(date: string | Date): string {
  if (typeof date === 'string') return date;
  return new Date().toISOString();
}
