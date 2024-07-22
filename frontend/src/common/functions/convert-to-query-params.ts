export function convertToQueryParams<T extends Record<string, string | number>>(
  params: T
) {
  const queryParams = Object.entries(params).map(
    ([key, value]) => `&${key}=${value}`
  );
  return queryParams;
}
