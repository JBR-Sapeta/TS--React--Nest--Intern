import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApplicationEntity } from '../../../entities';
import { PaginationDto, PaginationArgs } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

import { OfferApplicationPreviewDto } from './offer-application-prewiev.dto';

export class OfferApplicationsResponseDto
  extends PaginationDto
  implements ResponseWithPayload<OfferApplicationPreviewDto[]>
{
  @ApiProperty({ isArray: true, type: OfferApplicationPreviewDto })
  @Expose()
  data: OfferApplicationPreviewDto[];

  constructor(args: PaginationArgs, data: ApplicationEntity[]) {
    super(args);
    this.data = data.map(
      (application) => new OfferApplicationPreviewDto(application),
    );
  }
}
