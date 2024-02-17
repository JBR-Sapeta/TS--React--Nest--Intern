import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import { JWTPayload } from '../../common/types';

export const GetAccessTokenPayload = createParamDecorator(
  (_: never, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JWTPayload;
    return user.userId;
  },
);
