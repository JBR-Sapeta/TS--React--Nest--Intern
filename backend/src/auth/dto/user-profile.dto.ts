import { Exclude } from 'class-transformer';

import type { UserEntity } from '../../entities';

export class UserProfileDto {
  id: string;
  firsName: string;
  lastname: string;

  @Exclude()
  password: string;

  constructor(user: Partial<UserEntity>) {
    Object.assign(this, user);
  }
}
