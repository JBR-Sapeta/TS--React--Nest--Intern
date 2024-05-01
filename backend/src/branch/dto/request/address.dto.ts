import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Max, MaxLength, Min, MinLength } from 'class-validator';
import { toLower } from 'ramda';

import { PL_ERRORS } from '../../../locales';

export class AddressDto {
  @ApiProperty({ required: true, example: 'USA' })
  @MinLength(1, { message: PL_ERRORS.VALIDATION_ADDRESS_COUNTRY })
  country: string;

  @ApiProperty({ required: true, example: 'Massachusetts' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_ADDRESS_REGION })
  @MaxLength(64, { message: PL_ERRORS.VALIDATION_ADDRESS_REGION })
  @Transform(({ value }) => toLower(value))
  region: string;

  @ApiProperty({ required: true, example: 'MA 02127' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_ADDRESS_POSTCODE })
  @MaxLength(32, { message: PL_ERRORS.VALIDATION_ADDRESS_POSTCODE })
  postcode: string;

  @ApiProperty({ required: true, example: 'Boston' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_ADDRESS_CITY })
  @MaxLength(64, { message: PL_ERRORS.VALIDATION_ADDRESS_CITY })
  city: string;

  @ApiProperty({ required: true, example: 'Bolton St' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_ADDRESS_STREET })
  @MaxLength(64, { message: PL_ERRORS.VALIDATION_ADDRESS_STREET })
  streetName: string;

  @ApiProperty({ required: true, example: '258' })
  @MinLength(1, { message: PL_ERRORS.VALIDATION_ADDRESS_HOUSE_NUMBER })
  @MaxLength(16, { message: PL_ERRORS.VALIDATION_ADDRESS_HOUSE_NUMBER })
  houseNumber: string;

  @ApiProperty({ required: true, example: 42.3393541 })
  @IsNumber({}, { message: PL_ERRORS.VALIDATION_COMMON_IS_NUMBER })
  @Min(-90, { message: PL_ERRORS.VALIDATION_ADDRESS_LATITUDE })
  @Max(90, { message: PL_ERRORS.VALIDATION_ADDRESS_LATITUDE })
  latitude: number;

  @ApiProperty({ required: true, example: -71.04881 })
  @IsNumber({}, { message: PL_ERRORS.VALIDATION_COMMON_IS_NUMBER })
  @Min(-180, { message: PL_ERRORS.VALIDATION_ADDRESS_LONGITUDE })
  @Max(180, { message: PL_ERRORS.VALIDATION_ADDRESS_LONGITUDE })
  longitude: number;
}
