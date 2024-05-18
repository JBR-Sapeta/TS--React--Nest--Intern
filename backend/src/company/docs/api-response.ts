import {
  OK,
  BAD_REQUEST_PARAMS,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} from '../../common/docs';

import {
  CompaniesPreviewResponseDto,
  FullCompanyResponseDto,
  PartialCompanyDto,
} from '../dto/response';
import {
  ConflictExceptionResponseDto,
  CreateCompanyBadRequestResponseDto,
  UpdateCompanyBadRequestResponseDto,
  UploadImageBadGatewayExceptionResponseDto,
} from './dto';

export const RES = {
  GET_COMPANIES: {
    OK: {
      status: 200,
      description: 'Success',
      type: CompaniesPreviewResponseDto,
    },
    INTERNAL_SERVER_ERROR,
  },
  GET_COMPANY_BY_SLUG: {
    OK: {
      status: 200,
      description: 'Success',
      type: PartialCompanyDto,
    },
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  GET_USER_COMPANY: {
    OK: {
      status: 200,
      description: 'Success',
      type: FullCompanyResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  CREATE: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: CreateCompanyBadRequestResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    CONFLICT: {
      status: 409,
      description: 'Conflict',
      type: ConflictExceptionResponseDto,
    },
    INTERNAL_SERVER_ERROR,
  },
  UPDATE: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: UpdateCompanyBadRequestResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    CONFLICT: {
      status: 409,
      description: 'Conflict',
      type: ConflictExceptionResponseDto,
    },
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  UPLOAD_IMAGES: {
    OK,
    UNAUTHORIZED,
    BAD_REQUEST_PARAMS,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: UploadImageBadGatewayExceptionResponseDto,
    },
  },
  RESET_IMAGES: {
    OK,
    UNAUTHORIZED,
    BAD_REQUEST_PARAMS,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  DELETE: {
    OK,
    UNAUTHORIZED,
    BAD_REQUEST_PARAMS,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
};
