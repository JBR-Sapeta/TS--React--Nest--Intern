import { isArray } from 'class-validator';
import { RoleEntity } from '../../entity';
import { Roles } from '../enums';

export function hasRole(
  userRoles: RoleEntity[],
  roles: Roles | Roles[],
): boolean {
  const userRolesIds = userRoles.map((role) => role.id);

  let hasRole = false;
  if (isArray(roles)) {
    hasRole = roles.some((role) => userRolesIds.includes(role));
  } else {
    hasRole = userRolesIds.includes(roles);
  }

  return hasRole;
}
