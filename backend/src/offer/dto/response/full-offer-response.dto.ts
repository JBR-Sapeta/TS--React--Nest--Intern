import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { OfferEntity } from '../../../entities';

import { FullOfferDto } from './full-offer.dto';

export class FullOfferResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<FullOfferDto>
{
  @ApiProperty({ type: FullOfferDto })
  @Expose()
  data: FullOfferDto;

  constructor(args: SuccessMessageArgs, data: OfferEntity) {
    super(args);
    this.data = new FullOfferDto(data);
  }
}
