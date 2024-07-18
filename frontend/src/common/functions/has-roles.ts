import { UserRole } from '@Common/enums';
import { Role } from '@Common/types';

export function hasRoles(
  userRoles: Role[],
  expectedRoles: UserRole[]
): boolean {
  const userRolesIds = userRoles.map((role) => role.id);

  return expectedRoles.some((role) => userRolesIds.includes(role));
}
