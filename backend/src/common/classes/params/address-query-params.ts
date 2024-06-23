import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';
import type { SelectQueryBuilder } from 'typeorm';
import { isNotNil } from 'ramda';

import { KM_IN_M, REGION_MAP } from '../../constants';
import { PL_ERRORS } from '../../../locales';

export class AddressParams {
  @ApiProperty({
    minimum: 0,
    title: 'region',
    description: 'Region.',
    format: 'string',
    example: 'malopolska',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @Transform(({ value }) => REGION_MAP.get(value.toLowerCase()))
  region?: string;

  @ApiProperty({
    minimum: 0,
    title: 'city',
    description: 'City.',
    format: 'string',
    example: 'Warsaw',
    required: false,
  })
  @IsOptional()
  @Matches(/^[A-Z][a-zA-Z\s]+/, {
    message: PL_ERRORS.VALIDATION_COMMON_STRING_ALPHABETIC,
  })
  city?: string;

  @ApiProperty({
    minimum: 0,
    title: 'latitude',
    description: 'Latitude.',
    format: 'number',
    example: 50.070085,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90, { message: PL_ERRORS.VALIDATION_ADDRESS_LATITUDE })
  @Max(90, { message: PL_ERRORS.VALIDATION_ADDRESS_LATITUDE })
  lat?: number;

  @ApiProperty({
    minimum: 0,
    title: 'longitude',
    description: 'Longitude.',
    format: 'number',
    example: 19.525225,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180, { message: PL_ERRORS.VALIDATION_ADDRESS_LONGITUDE })
  @Max(180, { message: PL_ERRORS.VALIDATION_ADDRESS_LONGITUDE })
  long?: number;

  @ApiProperty({
    minimum: 0,
    title: 'Range',
    description: 'Range in KM.',
    example: 25,
    format: 'number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: PL_ERRORS.VALIDATION_COMMON_RANGE })
  @Max(100, { message: PL_ERRORS.VALIDATION_COMMON_RANGE })
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
