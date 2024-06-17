import { RoleEntity } from '../../entities';
import { Roles } from '../enums';

export function hasRole(userRoles: RoleEntity[], role: Roles): boolean {
  const roles = userRoles.map((role) => role.id);
  return roles.includes(role);
}
