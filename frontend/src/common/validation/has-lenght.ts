export function hasLength(
  value: string,
  length: number,
  message: string
): string {
  return value.length >= length ? '' : message;
}
