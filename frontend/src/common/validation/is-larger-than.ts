export function isLargerThan(value: number | string, min: number): string {
  return Number(value) > min ? '' : `Wartość powinna być wieksza od ${min}`;
}
