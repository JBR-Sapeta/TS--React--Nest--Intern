import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import type { RefreshTokenPayload } from '../../common/types';

export const GetRefreshTokenPayload = createParamDecorator(
  (_: never, context: ExecutionContext): RefreshTokenPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user as RefreshTokenPayload;
  },
);
