import { RoleEntity } from '../../entities';

export type JwtPayload = {
  userId: string;
  roles: RoleEntity[];
};

export type RTPayload = {
  userId: string;
  refreshToken: string;
};
