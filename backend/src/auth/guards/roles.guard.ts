import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { not } from 'ramda';

import { Roles } from '../../common/enums';
import { JwtPayload } from '../../common/types';
import { PL_ERRORS } from '../../locales';

type RequestWithUser = Request & {
  user: JwtPayload;
};

export const RolesGuard = (
  rolesWithAccess: Roles | Roles[],
): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();

      const userRoles = request.user.roles.map((role) => role.id);

      let canActivate = false;

      if (isArray(rolesWithAccess)) {
        canActivate = rolesWithAccess.some((role) => userRoles.includes(role));
      } else {
        canActivate = userRoles.includes(rolesWithAccess);
      }

      if (not(canActivate)) {
        throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INCORRECT_ROLE);
      }

      return canActivate;
    }
  }

  return mixin(RoleGuardMixin);
};
