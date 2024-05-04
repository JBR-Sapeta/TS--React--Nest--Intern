import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class UpdateOfferDto {
  @IsOptional()
  @ApiProperty({ required: false, example: 'Accountant Summer Internship' })
  @MinLength(4, { message: PL_ERRORS.VALIDATION_OFFER_TITLE })
  @MaxLength(64, { message: PL_ERRORS.VALIDATION_OFFER_TITLE })
  readonly title?: string;

  @IsOptional()
  @ApiProperty({ required: false, example: 'Accountant' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_OFFER_POSITION })
  @MaxLength(64, { message: PL_ERRORS.VALIDATION_OFFER_POSITION })
  readonly position?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'Description of accountant position...',
  })
  @MinLength(24, { message: PL_ERRORS.VALIDATION_OFFER_DESCRIPTION })
  @MaxLength(3072, { message: PL_ERRORS.VALIDATION_OFFER_DESCRIPTION })
  readonly description?: string;

  @IsOptional()
  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: PL_ERRORS.VALIDATION_OFFER_IS_PAID })
  readonly isPaid?: boolean;

  @IsOptional()
  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: PL_ERRORS.VALIDATION_OFFER_IS_ACTIVE })
  readonly isActive?: boolean;

  @IsOptional()
  @ApiProperty({ required: false, example: 1 })
  @IsInt({ message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  @Min(1, { message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  @Max(5, { message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  readonly employmentType?: number;

  @IsOptional()
  @ApiProperty({ required: false, example: 3 })
  @IsInt({ message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  @Min(1, { message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  @Max(3, { message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  readonly operatingMode?: number;

  @IsOptional()
  @ApiProperty({ required: false, example: [231, 249] })
  @ArrayNotEmpty({ message: PL_ERRORS.VALIDATION_OFFER_BRANCHES })
  @IsInt({ each: true, message: PL_ERRORS.VALIDATION_OFFER_BRANCHES })
  readonly branches?: number[];

  @IsOptional()
  @ApiProperty({ required: false, example: [4, 32, 33] })
  @ArrayNotEmpty({ message: PL_ERRORS.VALIDATION_OFFER_BRANCHES })
  @IsInt({ each: true, message: PL_ERRORS.VALIDATION_OFFER_CATEGORIES })
  readonly categories?: number[];
}
