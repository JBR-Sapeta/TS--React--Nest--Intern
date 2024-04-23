import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CategoryEntity } from '../../../entities';
import { isEmpty } from 'class-validator';

export class CategoryPreviewDto {
  @ApiProperty({ example: 10 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Logistics' })
  @Expose()
  public name: string;

  @ApiProperty({ example: null })
  @Expose()
  public parentId: number | null;

  @ApiProperty({
    isArray: true,
    type: CategoryPreviewDto,
    example: [
      { id: 62, name: 'Driver', parentId: 10, children: [] },
      { id: 63, name: 'Freight forwarder', parentId: 10, children: [] },
      { id: 64, name: 'Warehouse workerr', parentId: 10, children: [] },
    ],
  })
  @Expose()
  public children: CategoryPreviewDto[];

  constructor(category: CategoryEntity) {
    Object.assign(this, category);
    this.children = isEmpty(category.children)
      ? []
      : category.children.map((data) => new CategoryPreviewDto(data));
  }
}
