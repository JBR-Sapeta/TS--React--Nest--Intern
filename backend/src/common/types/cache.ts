import { RoleEntity } from '../../entity';

export type CachedUserData = {
  id: string;
  roles: RoleEntity[];
  refreshToken: string;
};
