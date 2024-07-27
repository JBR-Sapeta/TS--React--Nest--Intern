export function isInRange(
  value: number | string,
  min: number,
  max: number
): string {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return `Wartość powinna zawierać się w predziale od ${min} do ${max}.`;
  }

  return numericValue >= min && numericValue <= max
    ? ''
    : `Wartość powinna zawierać się w predziale od ${min} do ${max}.`;
}
