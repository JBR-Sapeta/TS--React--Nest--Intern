import { AxiosError } from 'axios';
import { isNil, isNotNil } from 'ramda';

import { BaseError, ValidationError } from '../../types';

function extractNestedErrors<T>(data: BaseError | Partial<string | T>): string {
  const messages = Object.values(data).map((element) => {
    if (typeof element === 'string') return element;

    if (typeof element === 'object') {
      return Object.values(element)
        .filter((val) => typeof val === 'string')
        .join('\n');
    }

    return null;
  });

  return messages.filter(isNotNil).join('\n');
}

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

  if (typeof message === 'string') {
    return message;
  }

  if (typeof message === 'object') {
    return extractNestedErrors(message);
  }

  return '';
}
