import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { OfferEntity } from '../../../entities';

import { PartialOfferDto } from './partial-offer.dto';

export class PartialOfferResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<PartialOfferDto>
{
  @ApiProperty({ type: PartialOfferDto })
  @Expose()
  data: PartialOfferDto;

  constructor(args: SuccessMessageArgs, data: OfferEntity) {
    super(args);
    this.data = new PartialOfferDto(data);
  }
}
