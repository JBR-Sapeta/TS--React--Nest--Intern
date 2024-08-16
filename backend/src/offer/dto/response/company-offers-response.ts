import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SuccessMessageArgs, SuccessMessageDto } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';
import { OfferEntity } from '../../../entity';

import { OfferPreviewDto } from './offer-preview.dto';

export class CompanyOffersResponseDto
  extends SuccessMessageDto
  implements ResponseWithPayload<OfferPreviewDto[]>
{
  @ApiProperty({ type: OfferPreviewDto })
  @Expose()
  data: OfferPreviewDto[];

  constructor(args: SuccessMessageArgs, offers: OfferEntity[]) {
    super(args);
    this.data = offers.map(
      (offer) => new OfferPreviewDto({ ...offer, categories: [] }),
    );
  }
}
