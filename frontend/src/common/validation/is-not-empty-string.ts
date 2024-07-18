import { isEmpty } from 'ramda';

export function isNotEmptyString(value: string, message: string): string {
  return isEmpty(value) ? message : '';
}
