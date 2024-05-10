import {
  OK,
  BAD_REQUEST_PARAMS,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} from '../../common/docs';
import {
  OfferApplicationsResponseDto,
  UserApplicationsResponseDto,
} from '../dto/response';

import {
  CreateApplicationBadGatewayExceptionResponseDto,
  CreateApplicationBadRequestResponseDto,
  DeleteApplicationBadGatewayExceptionResponseDto,
  GetApplicationBadGatewayExceptionResponseDto,
} from './dto';

export const RES = {
  CREATE: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: CreateApplicationBadRequestResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: CreateApplicationBadGatewayExceptionResponseDto,
    },
  },
  GET_APPLICATION_FILE: {
    BAD_REQUEST_PARAMS,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: GetApplicationBadGatewayExceptionResponseDto,
    },
  },
  GET_OFFER_APPLICATIONS: {
    OK: {
      status: 200,
      description: 'Success',
      type: OfferApplicationsResponseDto,
    },
    BAD_REQUEST_PARAMS,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  GET_USER_APPLICATIONS: {
    OK: {
      status: 200,
      description: 'Success',
      type: UserApplicationsResponseDto,
    },
    BAD_REQUEST_PARAMS,
    UNAUTHORIZED,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
  DELET: {
    OK,
    BAD_REQUEST_PARAMS,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: DeleteApplicationBadGatewayExceptionResponseDto,
    },
  },
};
