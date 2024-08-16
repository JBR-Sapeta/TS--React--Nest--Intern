import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApplicationEntity } from '../../../entity';
import { PaginationDto, PaginationArgs } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { UserApplicationPreviewDto } from './user-application-prewiev.dto';

export class UserApplicationsResponseDto
  extends PaginationDto
  implements ResponseWithPayload<UserApplicationPreviewDto[]>
{
  @ApiProperty({ isArray: true, type: UserApplicationPreviewDto })
  @Expose()
  data: UserApplicationPreviewDto[];

  constructor(args: PaginationArgs, data: ApplicationEntity[]) {
    super(args);
    this.data = data.map(
      (application) => new UserApplicationPreviewDto(application),
    );
  }
}
