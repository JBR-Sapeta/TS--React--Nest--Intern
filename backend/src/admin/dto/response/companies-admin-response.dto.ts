import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';
import { PaginationArgs, PaginationDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { CompanyAdminViewDto } from './company-admin-view.dto';

export class CompaniesAdminResponseDto
  extends PaginationDto
  implements ResponseWithPayload<CompanyAdminViewDto[]>
{
  @ApiProperty({ isArray: true, type: CompanyAdminViewDto })
  @Expose()
  data: CompanyAdminViewDto[];

  constructor(args: PaginationArgs, data: CompanyEntity[]) {
    super(args);
    this.data = data.map((company) => new CompanyAdminViewDto(company));
  }
}
