import { AxiosError } from 'axios';
import { isNil } from 'ramda';

import { HttpStatusCode } from '@Common/enums';
import type { Nullable, Nullish } from '@Common/types';
import type { BaseError } from '../../types';

/**
 * Extracts error response data from Axios error object. It returns null for BadRequestException
 */
export function extractBaseError(
  error: Nullish<AxiosError<BaseError>>
): Nullable<BaseError> {
  if (isNil(error) || isNil(error.response) || isNil(error.response.data)) {
    return null;
  }

  const { data } = error.response;

  if (data.statusCode === HttpStatusCode.BAD_REQUEST) {
    return null;
  }

  return data;
}
