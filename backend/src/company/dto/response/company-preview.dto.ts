import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CompanyEntity } from '../../../entities';

import { CategoryPreviewDto } from '../../../category/dto/response';

export class CompanyPreviewDto {
  @ApiProperty({ example: '67e42ba9-33df-4244-82a9-fe977293ab20' })
  @Expose()
  public id: string;

  @ApiProperty({ example: 'Company Name' })
  @Expose()
  public name: string;

  @ApiProperty({ example: 'company-name' })
  @Expose()
  public slug: string;

  @ApiProperty({
    example: `https://intern-images-development.s3.eu-north-1.amazonaws.com/new-company_logo_f1963095-2166-495c-bd64-954269c3af76`,
  })
  @Expose()
  public logoUrl: string | null;

  @ApiProperty({ example: 100 })
  @Expose()
  public size: number;

  @ApiProperty({ isArray: true, example: ['Cracov', 'Warsaw'] })
  @Expose()
  public locations: string[];

  @ApiProperty({ isArray: true, type: CategoryPreviewDto })
  @Expose()
  public categories: CategoryPreviewDto[];

  constructor({ categories, branches, ...companyData }: CompanyEntity) {
    this.locations = [
      ...new Set(branches.map((branch) => branch.address.city)),
    ];

    this.categories = categories.map(
      (category) => new CategoryPreviewDto(category),
    );
    Object.assign(this, companyData);
  }
}
