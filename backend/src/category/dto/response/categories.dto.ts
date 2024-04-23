import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { CategoryEntity } from '../../../entities';
import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { CategoryPreviewDto } from './category-preview.dto';

export class CategoriesDto
  extends SuccessMessageDto
  implements ResponseWithPayload<CategoryPreviewDto[]>
{
  @ApiProperty()
  @Expose()
  data: CategoryPreviewDto[];

  constructor(args: SuccessMessageArgs, data: CategoryEntity[]) {
    super(args);
    this.data = data.map((category) => new CategoryPreviewDto(category));
  }
}
