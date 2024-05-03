import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';
import { PaginationArgs, PaginationDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { CompanyPreviewDto } from './company-preview.dto';

export class CompaniesPreviewResponseDto
  extends PaginationDto
  implements ResponseWithPayload<CompanyPreviewDto[]>
{
  @ApiProperty({ isArray: true, type: CompanyPreviewDto })
  @Expose()
  data: CompanyPreviewDto[];

  constructor(args: PaginationArgs, data: CompanyEntity[]) {
    super(args);
    this.data = data.map((company) => new CompanyPreviewDto(company));
  }
}
