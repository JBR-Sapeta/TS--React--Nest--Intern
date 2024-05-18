import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';
import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { FullCompanyDto } from './full-company.dto';

export class FullCompanyResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<FullCompanyDto>
{
  @ApiProperty()
  @Expose()
  data: FullCompanyDto;

  constructor(args: SuccessMessageArgs, data: CompanyEntity) {
    super(args);
    this.data = new FullCompanyDto(data);
  }
}
