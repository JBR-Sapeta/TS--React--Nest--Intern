import {
  OK,
  CREATED,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../common/docs';

import { TokensDto } from '../dto/response';

import {
  ConflictExceptionResponseDto,
  SignUpBadRequestResponseDto,
  LoginBadRequestResponseDto,
  BadGatewayExceptionResponseDto,
  AccountRecoveryBadRequestResponseDto,
  ResetPasswordBadRequestResponseDto,
  ResendActivationEmailBadRequestResponseDto,
  ActivationBadRequestResponseDto,
} from './dto';

export const RES = {
  SIGN_UP: {
    CREATED,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: SignUpBadRequestResponseDto,
    },
    CONFLICT: {
      status: 409,
      description: 'Conflict',
      type: ConflictExceptionResponseDto,
    },
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: BadGatewayExceptionResponseDto,
    },
  },
  LOGIN: {
    OK: {
      status: 200,
      description: 'Succes',
      type: TokensDto,
    },
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: LoginBadRequestResponseDto,
    },
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR,
  },
  LOGOUT: {
    OK,
    UNAUTHORIZED,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
  REFRESH_TOKEN: {
    UNAUTHORIZED,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
  ACCOUNT_RECOVERY: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: AccountRecoveryBadRequestResponseDto,
    },
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: BadGatewayExceptionResponseDto,
    },
  },
  RESET_PASSWORD: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: ResetPasswordBadRequestResponseDto,
    },
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
  RESEND_ACTIVATION_EMAIL: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: ResendActivationEmailBadRequestResponseDto,
    },
    FORBIDDEN,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: {
      status: 502,
      description: 'Bad gateway',
      type: BadGatewayExceptionResponseDto,
    },
  },
  ACTIVATION: {
    OK,
    BAD_REQUEST: {
      status: 400,
      description: 'Bad request',
      type: ActivationBadRequestResponseDto,
    },
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
  },
};
