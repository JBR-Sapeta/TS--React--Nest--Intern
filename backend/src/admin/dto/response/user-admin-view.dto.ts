import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserEntity } from '../../../entity';

export class UserAdminViewDto {
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

  @ApiProperty({ example: false })
  @Expose()
  hasBan: boolean;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '2024-02-28T23:20:32.083Z' })
  @Expose()
  createdAt: string;

  constructor(user: UserEntity) {
    Object.assign(this, user);
    this.createdAt = user.createdAt.toISOString();
  }
}
