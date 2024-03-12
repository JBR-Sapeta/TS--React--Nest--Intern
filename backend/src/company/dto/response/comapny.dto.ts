import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';
import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

export class CompanyPreviewDto {
  @ApiProperty({ example: '67e42ba9-33df-4244-82a9-fe977293ab20' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Company Name' })
  @Expose()
  public name: string;

  @ApiProperty({ example: 'company-name' })
  @Expose()
  public slug: string;

  @ApiProperty({ example: 'companyname@mail.com' })
  @Expose()
  public email: string;

  @ApiProperty({ example: '48 733 546 854' })
  @Expose()
  public phoneNumber: string | null;

  @ApiProperty({ example: 'company-logo.wep' })
  @Expose()
  public logoUrl: string;

  @ApiProperty({ example: 'company.wep' })
  @Expose()
  public mainPhotoUrl: string;

  @ApiProperty({ example: 'Comppany name description.' })
  @Expose()
  public description: string;

  @ApiProperty({ example: 100 })
  @Expose()
  public size: number;

  @ApiProperty({ example: true })
  @Expose()
  public isVerfied: boolean;

  constructor(company: CompanyEntity) {
    Object.assign(this, company);
  }
}

export class CompanyDto
  extends SuccessMessageDto
  implements ResponseWithPayload<CompanyPreviewDto>
{
  @ApiProperty()
  @Expose()
  data: CompanyPreviewDto;

  constructor(args: SuccessMessageArgs, data: any) {
    super(args);
    this.data = new CompanyPreviewDto(data);
  }
}
