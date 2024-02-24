import { Expose } from 'class-transformer';
import { UserRoleEntity } from 'src/entities';

export class UserRoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  constructor(role: UserRoleEntity) {
    Object.assign(this, role);
  }
}
