import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { OfferEntity } from '../../../entities';

import { PardialOfferDto } from './partial-offer.dto';

export class PartialOfferResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<PardialOfferDto>
{
  @ApiProperty({ type: PardialOfferDto })
  @Expose()
  data: PardialOfferDto;

  constructor(args: SuccessMessageArgs, data: OfferEntity) {
    super(args);
    this.data = new PardialOfferDto(data);
  }
}
