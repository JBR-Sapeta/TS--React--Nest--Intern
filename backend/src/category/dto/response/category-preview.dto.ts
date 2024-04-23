import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CategoryEntity } from '../../../entities';
import { isEmpty } from 'class-validator';

export class CategoryPreviewDto {
  @ApiProperty({ example: 10 })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Logistics' })
  @Expose()
  public name: string;

  @ApiProperty({ example: 1 })
  @Expose()
  public parentId: number | null;

  @ApiProperty({ isArray: true, type: CategoryPreviewDto })
  @Expose()
  public children: CategoryPreviewDto[];

  constructor(category: CategoryEntity) {
    Object.assign(this, category);
    this.children = isEmpty(category.children)
      ? []
      : category.children.map((data) => new CategoryPreviewDto(data));
  }
}
