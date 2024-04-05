import {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../common/docs';

import { ProfileDto } from '../dto/response';

import {
  ConflictExceptionResponseDto,
  DeleteBadRequestExceptionResponseDto,
  EmailBadRequestExceptionResponseDto,
  PasswordBadRequestExceptionResponseDto,
  UpdateBadRequestExceptionResponseDto,
} from './dto';

export const RES = {
  ME: {
    OK: {
      status: 200,
      description: 'Success',
      type: ProfileDto,
    },
    UNAUTHORIZED,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  UPDATE: {
    OK: {
      status: 200,
      description: 'Success',
      type: ProfileDto,
    },
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: UpdateBadRequestExceptionResponseDto,
    },
    UNAUTHORIZED,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  EMAIL: {
    OK: {
      status: 200,
      description: 'Success',
      type: ProfileDto,
    },
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: EmailBadRequestExceptionResponseDto,
    },
    UNAUTHORIZED,
    NOT_FOUND,
    CONFLICT: {
      status: 409,
      description: 'Conflict',
      type: ConflictExceptionResponseDto,
    },
    INTERNAL_SERVER_ERROR,
  },

  PASSWORD: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: PasswordBadRequestExceptionResponseDto,
    },
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR,
  },
  DELETE: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: DeleteBadRequestExceptionResponseDto,
    },
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR,
  },
};
