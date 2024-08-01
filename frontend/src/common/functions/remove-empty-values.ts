import { isEmpty } from 'ramda';

export function removeEmptyValues<
  T extends Record<string, string | number | boolean>,
>(params: T) {
  const paramsCopy = structuredClone(params);

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string' && isEmpty(value)) {
      delete paramsCopy[key];
    }
  });

  return paramsCopy;
}
