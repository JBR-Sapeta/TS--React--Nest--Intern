import {
  OK,
  BAD_REQUEST_PARAMS,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} from '../../common/docs';
import {
  CompaniesAdminResponseDto,
  ErrorBucketsResponseDto,
  UsersAdminResponseDto,
} from '../dto/response';

export const RES = {
  GET_COMPANIES: {
    OK: {
      status: 200,
      description: 'Success',
      type: CompaniesAdminResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
  GET_LOGS: {
    OK: {
      status: 200,
      description: 'Success',
      type: ErrorBucketsResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
  GET_USERS: {
    OK: {
      status: 200,
      description: 'Success',
      type: UsersAdminResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
  VERIFY_COMPANY: {
    OK,
    BAD_REQUEST_PARAMS,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  BAN_USER: {
    OK,
    BAD_REQUEST_PARAMS,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
};
