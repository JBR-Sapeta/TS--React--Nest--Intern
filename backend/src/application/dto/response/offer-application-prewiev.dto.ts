import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ApplicationEntity } from '../../../entity';
import { UserPreviewDto } from '../../../user/dto/response';

export class OfferApplicationPreviewDto {
  @ApiProperty({ example: 356 })
  @Expose()
  public id: string;

  @ApiProperty({ example: 'Optional message to company..' })
  @Expose()
  public message: string;

  @ApiProperty({ example: false })
  @Expose()
  public isDownloaded: boolean;

  @ApiProperty({ example: '2024-04-28T19:25:52.083Z' })
  @Expose()
  public createdAt: string;

  @ApiProperty({ type: UserPreviewDto })
  @Expose()
  public user: UserPreviewDto;

  constructor({ createdAt, user, ...aaplicationData }: ApplicationEntity) {
    this.createdAt = createdAt.toISOString();
    this.user = new UserPreviewDto(user);
    Object.assign(this, aaplicationData);
  }
}
