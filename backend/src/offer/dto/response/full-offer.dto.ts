import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { OfferEntity } from '../../../entity';
import { BranchPreviewDto } from '../../../branch/dto/response';
import { CategoryPreviewDto } from '../../../category/dto/response';

export class FullOfferDto {
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

  @ApiProperty({ example: '2024-04-25T14:48:00.000Z' })
  @Expose()
  public expirationDate: string;

  @ApiProperty({ example: '2024-05-24T14:48:00.000Z' })
  @Expose()
  public removalDate: string;

  @ApiProperty({ example: '2024-04-01T14:48:00.000Z' })
  @Expose()
  public createdAt: string;

  @ApiProperty({ example: '2024-04-01T14:48:00.000Z' })
  @Expose()
  public updatedAt: string;

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

  @ApiProperty({ example: '728bee6e-9465-48aa-8b0f-2c58318ec595' })
  @Expose()
  public companyId: string;

  constructor({
    createdAt,
    updatedAt,
    expirationDate,
    removalDate,
    branches,
    categories,
    ...offerData
  }: OfferEntity) {
    this.createdAt = createdAt.toISOString();
    this.updatedAt = updatedAt.toISOString();
    this.expirationDate = expirationDate.toISOString();
    this.removalDate = removalDate.toISOString();
    this.branches = branches.map((branch) => new BranchPreviewDto(branch));
    this.categories = categories.map(
      (category) => new CategoryPreviewDto(category),
    );
    Object.assign(this, offerData);
  }
}
