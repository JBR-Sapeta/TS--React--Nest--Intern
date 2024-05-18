import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';

import { BranchPreviewDto } from '../../../branch/dto/response';
import { CategoryPreviewDto } from '../../../category/dto/response';

export class FullCompanyDto {
  @ApiProperty({ example: '67e42ba9-33df-4244-82a9-fe977293ab20' })
  @Expose()
  public id: string;

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

  @ApiProperty({
    example:
      'https://intern-images-development.s3.eu-north-1.amazonaws.com/new-company_logo_f1963095-2166-495c-bd64-954269c3af76',
  })
  @Expose()
  public logoUrl: string | null;

  @ApiProperty({ example: null })
  @Expose()
  public mainPhotoUrl: string | null;

  @ApiProperty({ example: 'Comppany name description.' })
  @Expose()
  public description: string;

  @ApiProperty({ example: 100 })
  @Expose()
  public size: number;

  @ApiProperty({ example: true })
  @Expose()
  public isVerified: boolean;

  @ApiProperty({ example: '2024-04-01T14:48:00.000Z' })
  @Expose()
  public createdAt: string;

  @ApiProperty({ isArray: true, type: BranchPreviewDto })
  @Expose()
  public branches: BranchPreviewDto[];

  @ApiProperty({ isArray: true, type: CategoryPreviewDto })
  @Expose()
  public categories: CategoryPreviewDto[];

  constructor({
    branches,
    categories,
    createdAt,
    ...companyData
  }: CompanyEntity) {
    this.createdAt = createdAt.toISOString();
    this.branches = branches.map((branch) => new BranchPreviewDto(branch));
    this.categories = categories.map(
      (category) => new CategoryPreviewDto(category),
    );

    Object.assign(this, companyData);
  }
}
