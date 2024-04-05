import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { BranchEntity } from '../../../entities';

import { BranchPreviewDto } from './branch-preview.dto';

export class BranchesDto
  extends SuccessMessageDto
  implements ResponseWithPayload<BranchPreviewDto[]>
{
  @ApiProperty({ isArray: true, type: BranchPreviewDto })
  @Expose()
  data: BranchPreviewDto[];

  @ApiProperty()
  @Expose()
  count: number;

  constructor(args: SuccessMessageArgs, data: BranchEntity[], count: number) {
    super(args);
    this.count = count;
    this.data = data.map((branch) => new BranchPreviewDto(branch));
  }
}
