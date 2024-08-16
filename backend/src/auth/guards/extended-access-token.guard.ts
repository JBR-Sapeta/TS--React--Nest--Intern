import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserEntity } from '../../entity';
import { PL_ERRORS } from '../../locales';

export class ExtendedAccessTokenGuard extends AuthGuard(
  'extended-jwt-access-token',
) {
  constructor() {
    super();
  }

  handleRequest<TUser = UserEntity>(err: unknown, user: TUser | false): TUser {
    if (err || !user) {
      throw new UnauthorizedException(PL_ERRORS.UNAUTHORIZED);
    }

    return user;
  }
}
