import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import type { UserEntity } from '../../../entities';
import { SuccessMessageDto } from '../../../common/classes';
import type { SuccessMessageArgs } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { RoleDto } from '../request/role.dto';

class UserProfileDto {
  @ApiProperty({ example: '67e42ba9-33df-4244-82a9-fe977293ab20' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'John' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: 'user@mail.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: '723442564' })
  @Expose()
  phoneNumber: string | null;

  @ApiProperty({ example: [{ id: 2, name: 'user' }] })
  @Expose()
  roles: RoleDto[];

  @ApiProperty({ example: [34, 45, 67] })
  @Expose()
  applications: number[];

  @ApiProperty({ example: '2024-02-28T23:20:32.083Z' })
  @Expose()
  createdAt: string;

  constructor(user: UserEntity) {
    Object.assign(this, user);
    this.createdAt = user.createdAt.toISOString();
    this.roles = user.roles.map((role) => new RoleDto(role));
    this.applications = user.applications
      ? user.applications.map((app) => app.offerId)
      : [];
  }
}

export class ProfileDto
  extends SuccessMessageDto
  implements ResponseWithPayload<UserProfileDto>
{
  @ApiProperty()
  @Expose()
  data: UserProfileDto;

  constructor(args: SuccessMessageArgs, data: any) {
    super(args);
    this.data = new UserProfileDto(data);
  }
}
