import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { OfferEntity } from '../../../entities';

import { CategoryPreviewDto } from '../../../category/dto/response';
import { BaseCompanyDto } from '../../../company/dto/response';

export class OfferPreviewDto {
  @ApiProperty({ example: 356 })
  @Expose()
  public id: string;

  @ApiProperty({ example: 'Accountant Summer Internship' })
  @Expose()
  public title: string;

  @ApiProperty({ example: 'Accountant' })
  @Expose()
  public position: string;

  @ApiProperty({ example: true })
  @Expose()
  public isPaid: boolean;

  @ApiProperty({ example: true })
  @Expose()
  public isActive: boolean;

  @ApiProperty({ example: '2024-04-01T14:48:00.000Z' })
  @Expose()
  public createdAt: string;

  @ApiProperty({ example: 1 })
  @Expose()
  public employmentTypeId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  public operatingModeId: number;

  @ApiProperty({ isArray: true, example: ['Cracov', 'Warsaw'] })
  @Expose()
  public locations: string[];

  @ApiProperty({ isArray: true, type: CategoryPreviewDto })
  @Expose()
  public categories: CategoryPreviewDto[];

  @ApiProperty({ type: BaseCompanyDto })
  @Expose()
  public company: BaseCompanyDto;

  constructor({
    categories,
    company,
    createdAt,
    branches,
    ...offerData
  }: OfferEntity) {
    this.createdAt = createdAt.toISOString();
    this.locations = [
      ...new Set(branches.map((branch) => branch.address.city)),
    ];
    this.company = new BaseCompanyDto(company);
    this.categories = categories.map(
      (category) => new CategoryPreviewDto(category),
    );
    Object.assign(this, offerData);
  }
}
