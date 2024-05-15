import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '../../common/types';

export const GetAccessTokenPayload = createParamDecorator(
  (_: never, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user;
  },
);
