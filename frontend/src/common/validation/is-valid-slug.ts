const pattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidSlug(value: string): string {
  return pattern.test(value)
    ? ''
    : `Wprowadź prawidłowy slug  np. nazwa-nowej-firmy`;
}
