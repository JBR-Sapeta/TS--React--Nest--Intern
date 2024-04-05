import { Expose } from 'class-transformer';
import { RoleEntity } from '../../../entities';

export class RoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  constructor(role: RoleEntity) {
    Object.assign(this, role);
  }
}
