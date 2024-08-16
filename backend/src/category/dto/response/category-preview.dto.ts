import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CategoryEntity } from '../../../entity';

export class CategoryPreviewDto {
  @ApiProperty({ example: 10 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Logistics' })
  @Expose()
  public name: string;

  constructor(category: CategoryEntity) {
    Object.assign(this, category);
  }
}
