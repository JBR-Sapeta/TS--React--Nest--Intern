import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApplicationEntity } from '../../../entity';
import { BaseOfferDto } from '../../../offer/dto/response';

export class UserApplicationPreviewDto {
  @ApiProperty({ example: 356 })
  @Expose()
  public id: string;

  @ApiProperty({ example: 'Optional message to company...' })
  @Expose()
  public message: string;

  @ApiProperty({ example: false })
  @Expose()
  public isDownloaded: boolean;

  @ApiProperty({ example: '2024-04-28T19:25:52.083Z' })
  @Expose()
  public createdAt: string;

  @ApiProperty({ type: BaseOfferDto })
  @Expose()
  public offer: BaseOfferDto;

  constructor({ createdAt, offer, ...aaplicationData }: ApplicationEntity) {
    this.createdAt = createdAt.toISOString();
    this.offer = new BaseOfferDto(offer);
    Object.assign(this, aaplicationData);
  }
}
