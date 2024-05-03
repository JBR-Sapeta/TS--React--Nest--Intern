import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PaginationDto, PaginationArgs } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { OfferEntity } from '../../../entities';

import { OfferPreviewDto } from './offer-preview.dto';

export class OfferPreviewsResponseDto
  extends PaginationDto
  implements ResponseWithPayload<OfferPreviewDto[]>
{
  @ApiProperty({ type: OfferPreviewDto })
  @Expose()
  data: OfferPreviewDto[];

  constructor(args: PaginationArgs, data: OfferEntity[]) {
    super(args);
    this.data = data.map((offer) => new OfferPreviewDto(offer));
  }
}
