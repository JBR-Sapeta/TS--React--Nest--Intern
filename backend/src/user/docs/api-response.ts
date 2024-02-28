import {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../common/docs';

import { ProfileDto } from '../dto';

import {
  ConflictExceptionResponseDto,
  DeleteBadRequestResponseDto,
  EmailBadRequestResponseDto,
  PasswordBadRequestResponseDto,
  UpdateBadRequestResponseDto,
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
      type: UpdateBadRequestResponseDto,
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
      type: EmailBadRequestResponseDto,
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
      type: PasswordBadRequestResponseDto,
    },
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR,
  },
  DELETE: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: DeleteBadRequestResponseDto,
    },
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR,
  },
};
