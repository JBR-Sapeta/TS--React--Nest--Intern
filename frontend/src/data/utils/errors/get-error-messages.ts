import { AxiosError } from 'axios';
import { isNil } from 'ramda';

import { BaseError, ValidationError } from '../../types';

/**
 * Gets value of error messages from Axios error object.
 */
export function getErrorMessages<T>(
  error: AxiosError<ValidationError<Partial<T | string> | BaseError>>
): string {
  if (isNil(error) || isNil(error.response) || isNil(error.response.data)) {
    return '';
  }

  const { message } = error.response.data;

  if (typeof message === 'object') {
    return Object.values(message).join('\n');
  }

  if (typeof message !== 'object') {
    return message;
  }

  return '';
}
