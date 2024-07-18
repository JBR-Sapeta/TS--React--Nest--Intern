import { AxiosError } from 'axios';
import { isNil } from 'ramda';

import { HttpStatusCode } from '@Common/enums';
import type { Nullish } from '@Common/types';

import { ValidationError } from '../../types';

/**
 * Extracts validation error messages from Axios error object.
 */
export function extractValidationError<T>(
  emptyErrorState: T,
  error: Nullish<AxiosError<ValidationError<Partial<T | string>>>>
): T {
  if (isNil(error) || isNil(error.response) || isNil(error.response.data)) {
    return emptyErrorState;
  }

  const { message, statusCode } = error.response.data;

  if (statusCode !== HttpStatusCode.BAD_REQUEST) {
    return emptyErrorState;
  }

  if (typeof message !== 'object') {
    return emptyErrorState;
  }

  return { ...emptyErrorState, ...message };
}
