import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserEntity } from '../../../entity';
import { PaginationArgs, PaginationDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { UserAdminViewDto } from './user-admin-view.dto';

export class UsersAdminResponseDto
  extends PaginationDto
  implements ResponseWithPayload<UserAdminViewDto[]>
{
  @ApiProperty({ isArray: true, type: UserAdminViewDto })
  @Expose()
  data: UserAdminViewDto[];

  constructor(args: PaginationArgs, data: UserEntity[]) {
    super(args);
    this.data = data.map((company) => new UserAdminViewDto(company));
  }
}
