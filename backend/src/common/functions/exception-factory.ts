import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export function exceptionFactory(errors: ValidationError[]) {
  const errorObject = { statusCode: 400, message: null, error: 'Bad Request' };
  const errorMap = errors.map((error) => ({
    [error.property]: error.constraints[Object.keys(error.constraints)[0]],
  }));

  errorObject.message = Object.assign({}, ...errorMap);

  return new BadRequestException(errorObject);
}
