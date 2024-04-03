import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';
import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { CompanyPreviewDto } from './company-preview.dto';

export class CompanyDto
  extends SuccessMessageDto
  implements ResponseWithPayload<CompanyPreviewDto>
{
  @ApiProperty()
  @Expose()
  data: CompanyPreviewDto;

  constructor(args: SuccessMessageArgs, data: CompanyEntity) {
    super(args);
    this.data = new CompanyPreviewDto(data);
  }
}
