import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { OfferEntity } from '../../../entities';
import { transformDate } from '../../../common/functions';
import { CategoryPreviewDto } from '../../../category/dto/response';
import { CompanyPreviewDto } from '../../../company/dto/response';
import { BranchPreviewDto } from '../../../branch/dto/response';

export class PartialOfferDto {
  @ApiProperty({ example: 356 })
  @Expose()
  public id: string;

  @ApiProperty({ example: 'Accountant Summer Internship' })
  @Expose()
  public title: string;

  @ApiProperty({ example: 'Accountant' })
  @Expose()
  public position: string;

  @ApiProperty({ example: 'Description of accountant position...' })
  @Expose()
  public description: string;

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

  @ApiProperty({ isArray: true, type: BranchPreviewDto })
  @Expose()
  public branches: BranchPreviewDto[];

  @ApiProperty({ isArray: true, type: CategoryPreviewDto })
  @Expose()
  public categories: CategoryPreviewDto[];

  @ApiProperty({ type: CompanyPreviewDto })
  @Expose()
  public company: CompanyPreviewDto;

  constructor({
    categories,
    company,
    createdAt,
    branches,
    ...offerData
  }: OfferEntity) {
    this.createdAt = transformDate(createdAt);
    this.branches = branches.map((branch) => new BranchPreviewDto(branch));
    this.company = new CompanyPreviewDto(company);
    this.categories = categories.map(
      (category) => new CategoryPreviewDto(category),
    );
    Object.assign(this, offerData);
  }
}
