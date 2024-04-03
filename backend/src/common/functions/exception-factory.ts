import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export function exceptionFactory(errors: ValidationError[]) {
  const errorObject = { statusCode: 400, message: null, error: 'Bad Request' };
  const errorMap = errors.map((error) => {
    if (error.constraints) {
      return {
        [error.property]: error.constraints[Object.keys(error.constraints)[0]],
      };
    }

    if (error.children) {
      const errorObject = {};

      for (const childError of error.children) {
        errorObject[childError.property] =
          childError.constraints[Object.keys(childError.constraints)[0]];
      }

      return {
        [error.property]: errorObject,
      };
    }
  });

  errorObject.message = Object.assign({}, ...errorMap);

  return new BadRequestException(errorObject);
}
