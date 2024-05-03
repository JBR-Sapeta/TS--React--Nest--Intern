import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';
import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { PartialCompanyDto } from './partial-comapny.dto';

export class PartialCompanyResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<PartialCompanyDto>
{
  @ApiProperty()
  @Expose()
  data: PartialCompanyDto;

  constructor(args: SuccessMessageArgs, data: CompanyEntity) {
    super(args);
    this.data = new PartialCompanyDto(data);
  }
}
