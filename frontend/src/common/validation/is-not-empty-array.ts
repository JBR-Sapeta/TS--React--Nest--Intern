import { isEmpty } from 'ramda';

export function isNotEmptyArray<T>(value: Array<T>, message: string): string {
  return isEmpty(value) ? message : '';
}
