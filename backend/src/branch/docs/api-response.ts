import {
  OK,
  BAD_REQUEST_PARAMS,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../common/docs';

import { BranchesDto } from '../dto/response';
import {
  BadGatewayExceptionResponseDto,
  CreateBadRequestResponseDto,
  UpdateBadRequestResponseDto,
} from './dto';

export const RES = {
  GET_COMAPNY_BRANCHES: {
    OK: {
      status: 200,
      description: 'Success',
      type: BranchesDto,
    },
    BAD_REQUEST_PARAMS,
    INTERNAL_SERVER_ERROR,
  },
  CREATE: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: CreateBadRequestResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: BadGatewayExceptionResponseDto,
    },
  },
  UPDATE: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: UpdateBadRequestResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: BadGatewayExceptionResponseDto,
    },
  },
  DELETE: {
    OK,
    BAD_REQUEST_PARAMS,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
};
