import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { AddressEntity } from '../../../entities';

export class AddressPreviewDto {
  @ApiProperty({ example: 2137 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'USA' })
  @Expose()
  country: string;

  @ApiProperty({ example: 'Massachusetts' })
  @Expose()
  region: string;

  @ApiProperty({ example: 'MA 02127' })
  @Expose()
  postcode: string;

  @ApiProperty({ example: 'Boston' })
  @Expose()
  city: string;

  @ApiProperty({ example: 'Bolton St' })
  @Expose()
  streetName: string;

  @ApiProperty({ example: '258' })
  @Expose()
  houseNumber: string;

  @ApiProperty({ example: 42.3393541 })
  @Expose()
  latitude: number;

  @ApiProperty({ example: -71.04881 })
  @Expose()
  longitude: number;

  constructor(address: AddressEntity) {
    Object.assign(this, address);
  }
}
