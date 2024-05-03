import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import type { SelectQueryBuilder } from 'typeorm';
import { isNotNil } from 'ramda';

import { KM_IN_M, REGION_MAP } from '../../constants';

export class AddressParams {
  @ApiProperty({
    minimum: 0,
    title: 'region',
    description: 'Region.',
    format: 'string',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => REGION_MAP.get(value))
  region?: string;

  @ApiProperty({
    minimum: 0,
    title: 'city',
    description: 'City.',
    format: 'string',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  city?: string;

  @ApiProperty({
    minimum: 0,
    title: 'latitude',
    description: 'Latitude.',
    format: 'number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiProperty({
    minimum: 0,
    title: 'longitude',
    description: 'Longitude.',
    format: 'number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  long?: number;

  @ApiProperty({
    minimum: 0,
    title: 'longitude',
    description: 'Longitude.',
    format: 'number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  range?: number;
}

export function addAddressParamsToQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  address: AddressParams,
) {
  const { city, region, long, lat, range } = address;

  if (city) {
    queryBuilder.andWhere('address.city = :city', { city });
  }

  if (region) {
    queryBuilder.andWhere('address.region = :region', { region });
  }

  if (isNotNil(long) && isNotNil(lat) && isNotNil(range)) {
    const radius = range * KM_IN_M;

    queryBuilder.andWhere(
      'ST_DWithin(address.location, ST_SetSRID(ST_MakePoint(:long ,:lat),4326), :radius)',
      { long, lat, radius },
    );
  }
}
