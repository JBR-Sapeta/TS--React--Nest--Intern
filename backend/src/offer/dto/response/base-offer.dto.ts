import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { OfferEntity } from '../../../entities';

export class BaseOfferDto {
  @ApiProperty({ example: 356 })
  @Expose()
  public id: string;

  @ApiProperty({ example: 'new-company' })
  @Expose()
  public slug: string;

  @ApiProperty({ example: 'Accountant Summer Internship' })
  @Expose()
  public title: string;

  @ApiProperty({ example: 'Accountant' })
  @Expose()
  public position: string;

  @ApiProperty({ example: '67e42ba9-33df-4244-82a9-fe977293ab20' })
  @Expose()
  public companyId: string;

  @ApiProperty({ example: 'New company' })
  @Expose()
  public companyName: string;

  @ApiProperty({ example: 'new-company.png' })
  @Expose()
  public logoUrl: string;

  @ApiProperty({ example: true })
  @Expose()
  public isActive: boolean;

  constructor({ company, ...offerData }: OfferEntity) {
    this.companyId = company.id;
    this.companyName = company.name;
    this.logoUrl = company.logoUrl;
    this.slug = company.slug;
    Object.assign(this, offerData);
  }
}
