import { SuccessMessageDto } from '../classes';

import {
  ConflictExceptionResponseDto,
  CreatedResponseDto,
  ForbiddenExceptionResponseDto,
  InternalServerErrorExceptionResponseDto,
  NotFoundExceptionResponseDto,
  UnauthorizedExceptionResponseDto,
} from './dto';

export const OK = {
  status: 200,
  description: 'Succes',
  type: SuccessMessageDto,
};

export const CREATED = {
  status: 201,
  description: 'Created',
  type: CreatedResponseDto,
};

export const UNAUTHORIZED = {
  status: 401,
  description: 'Invalid credentials',
  type: UnauthorizedExceptionResponseDto,
};

export const FORBIDDEN = {
  status: 403,
  description: 'Forbidden',
  type: ForbiddenExceptionResponseDto,
};

export const NOT_FOUND = {
  status: 404,
  description: 'Not Found',
  type: NotFoundExceptionResponseDto,
};

export const CONFLICT = {
  status: 409,
  description: 'Conflict',
  type: ConflictExceptionResponseDto,
};

export const INTERNAL_SERVER_ERROR = {
  status: 500,
  description: 'Internal Server Error',
  type: InternalServerErrorExceptionResponseDto,
};
