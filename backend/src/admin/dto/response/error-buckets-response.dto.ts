import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { ErrorBucketsDto } from './error-buckets.dto';

export class ErrorBucketsResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<ErrorBucketsDto>
{
  @ApiProperty()
  @Expose()
  data: ErrorBucketsDto;

  constructor(args: SuccessMessageArgs, data: ErrorBucketsDto) {
    super(args);
    this.data = data;
  }
}
