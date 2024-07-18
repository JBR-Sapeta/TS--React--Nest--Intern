export function isSameString(
  valueA: string,
  valueB: string,
  message: string
): string {
  return valueA === valueB ? '' : message;
}
