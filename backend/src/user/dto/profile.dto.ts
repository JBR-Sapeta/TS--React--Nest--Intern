import { Expose } from 'class-transformer';

import type { UserEntity } from '../../entities';
import { SuccesMessage } from '../../common/classes';
import type { SuccesMessageArgs } from '../../common/classes';
import { ResponseWithPayload } from '../../common/interfaces';
import { UserRoleDto } from './role.dto';

class UserProfileDto {
  @Expose()
  id: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  email: string;
  @Expose()
  phoneNumber: string;
  @Expose()
  roles: UserRoleDto[];
  @Expose()
  createdAt: string;

  constructor(user: UserEntity) {
    Object.assign(this, user);
    this.createdAt = user.createdAt.toISOString();
    this.roles = user.roles.map((role) => new UserRoleDto(role));
  }
}

export class ProfileDto
  extends SuccesMessage
  implements ResponseWithPayload<UserProfileDto>
{
  @Expose()
  data: UserProfileDto;

  constructor(args: SuccesMessageArgs, data: any) {
    super(args);
    this.data = new UserProfileDto(data);
  }
}

// -------  Base Solution Dose Not Work ------- //
// https://github.com/typestack/class-transformer/issues/740
