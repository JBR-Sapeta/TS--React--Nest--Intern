import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import { UserEntity } from '../../entities';

export const GetAccessTokentExtendedPayload = createParamDecorator(
  (_: never, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    return user;
  },
);
