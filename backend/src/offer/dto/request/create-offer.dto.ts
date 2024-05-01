import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class CreateOfferDto {
  @ApiProperty({ required: true, example: 'Accountant Summer Internship' })
  @MinLength(4, { message: PL_ERRORS.VALIDATION_OFFER_TITLE })
  @MaxLength(64, { message: PL_ERRORS.VALIDATION_OFFER_TITLE })
  readonly title: string;

  @ApiProperty({ required: true, example: 'Accountant' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_OFFER_POSITION })
  @MaxLength(64, { message: PL_ERRORS.VALIDATION_OFFER_POSITION })
  readonly position: string;

  @ApiProperty({
    required: true,
    example: 'Description of accountant position...',
  })
  @MinLength(24, { message: PL_ERRORS.VALIDATION_OFFER_DESCRIPTION })
  @MaxLength(3072, { message: PL_ERRORS.VALIDATION_OFFER_DESCRIPTION })
  readonly description: string;

  @ApiProperty({ required: true, example: true })
  @IsBoolean({ message: PL_ERRORS.VALIDATION_OFFER_IS_PAID })
  readonly isPaid: boolean;

  @ApiProperty({ required: true, example: true })
  @IsBoolean({ message: PL_ERRORS.VALIDATION_OFFER_IS_ACTIVE })
  readonly isActive: boolean;

  @ApiProperty({ required: true, example: 28 })
  @IsInt({ message: PL_ERRORS.VALIDATION_OFFER_EXPIRATION_TIME })
  @Max(42, { message: PL_ERRORS.VALIDATION_OFFER_EXPIRATION_TIME })
  @Min(7, { message: PL_ERRORS.VALIDATION_OFFER_EXPIRATION_TIME })
  readonly expirationTime: number;

  @ApiProperty({ required: true, example: 1 })
  @IsInt({ message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  @Min(1, { message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  readonly employmentType: number;

  @ApiProperty({ required: true, example: 3 })
  @IsInt({ message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  @Min(1, { message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  readonly operatingMode: number;

  @ApiProperty({ required: true, example: [231, 249] })
  @ArrayNotEmpty({ message: PL_ERRORS.VALIDATION_OFFER_BRANCHES })
  @IsInt({ each: true, message: PL_ERRORS.VALIDATION_OFFER_BRANCHES })
  readonly branches: number[];

  @ApiProperty({ required: true, example: [4, 32, 33] })
  @ArrayNotEmpty({ message: PL_ERRORS.VALIDATION_OFFER_BRANCHES })
  @IsInt({ each: true, message: PL_ERRORS.VALIDATION_OFFER_CATEGORIES })
  readonly categories: number[];
}
