import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtPayload } from '../../common/types';
import { PL_ERRORS } from '../../locales';

export class AccessTokenGuard extends AuthGuard('jwt-access-token') {
  constructor() {
    super();
  }

  handleRequest<TUser = JwtPayload>(err: unknown, user: TUser | false): TUser {
    if (err || !user) {
      throw new UnauthorizedException(PL_ERRORS.UNAUTHORIZED);
    }

    return user;
  }
}
