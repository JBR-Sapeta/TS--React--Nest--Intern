import {
  OK,
  BAD_REQUEST_PARAMS,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} from '../../common/docs';

import {
  OfferPreviewsResponseDto,
  PartialOfferResponseDto,
  FullOfferResponseDto,
} from '../dto/response';
import { GetOffersBadRequestResponseDto } from './dto';

export const RES = {
  GET_OFFERS: {
    OK: {
      status: 200,
      description: 'Success',
      type: OfferPreviewsResponseDto,
    },
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: GetOffersBadRequestResponseDto,
    },
    INTERNAL_SERVER_ERROR,
  },
  GET_PARTIAL_OFFER: {
    OK: {
      status: 200,
      description: 'Success',
      type: PartialOfferResponseDto,
    },
    BAD_REQUEST_PARAMS,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  GET_FULL_OFFER: {
    OK: {
      status: 200,
      description: 'Success',
      type: FullOfferResponseDto,
    },
    BAD_REQUEST_PARAMS,
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
      type: GetOffersBadRequestResponseDto,
    },
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
  },
  UPDATE: {
    OK,
    UNAUTHORIZED,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: GetOffersBadRequestResponseDto,
    },
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
