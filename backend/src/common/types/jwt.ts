import { RoleEntity } from '../../entity';

export type JwtPayload = {
  userId: string;
  roles: RoleEntity[];
};

export type RTPayload = {
  userId: string;
  refreshToken: string;
};
