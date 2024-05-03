import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CategoryEntity } from '../../../entities';
import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { FullCategoryDto } from './full-category.dto';

export class FullCategoriesResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<FullCategoryDto[]>
{
  @ApiProperty({ isArray: true, type: FullCategoryDto })
  @Expose()
  data: FullCategoryDto[];

  constructor(args: SuccessMessageArgs, data: CategoryEntity[]) {
    super(args);
    this.data = data.map((category) => new FullCategoryDto(category));
  }
}
