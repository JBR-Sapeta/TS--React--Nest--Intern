import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import type { RTPayload } from '../../common/types';

export const GetRefreshTokenPayload = createParamDecorator(
  (_: never, context: ExecutionContext): RTPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user as RTPayload;
  },
);
