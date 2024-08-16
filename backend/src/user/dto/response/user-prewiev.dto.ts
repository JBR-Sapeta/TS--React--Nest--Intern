import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import type { UserEntity } from '../../../entity';

export class UserPreviewDto {
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

  constructor(user: UserEntity) {
    Object.assign(this, user);
  }
}
