import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  Matches,
  IsOptional,
  IsPositive,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class UpdateCompanyDto {
  @ApiProperty({ required: true, example: 'New Company' })
  @IsOptional()
  @MinLength(1, { message: PL_ERRORS.VALIDATION_COMPANY_NAME })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_COMPANY_NAME })
  readonly name?: string;

  @ApiProperty({ required: true, example: 'new-company' })
  @IsOptional()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: PL_ERRORS.VALIDATION_COMPANY_SLUG,
  })
  @MinLength(1, { message: PL_ERRORS.VALIDATION_COMPANY_SLUG_SIZE })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_COMPANY_SLUG_SIZE })
  readonly slug?: string;

  @ApiProperty({ required: true, example: 'newcomapny@mail.com' })
  @IsOptional()
  @IsEmail({}, { message: PL_ERRORS.VALIDATION_COMMON_EMAIL })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_COMMON_EMAIL })
  readonly email?: string;

  @ApiProperty({ example: '48 731 432 561' })
  @IsOptional()
  @IsPhoneNumber('PL', { message: PL_ERRORS.VALIDATION_COMPANY_PHONE })
  readonly phoneNumber?: string | null;

  @ApiProperty({ required: true, example: 'Comapny Description' })
  @IsOptional()
  @MinLength(32, { message: PL_ERRORS.VALIDATION_COMPANY_DESCRIPTION })
  readonly description?: string;

  @ApiProperty({ required: true, example: 100 })
  @IsOptional()
  @IsPositive({ message: PL_ERRORS.VALIDATION_COMPANY_SIZE })
  readonly size?: number;

  @IsOptional()
  @ApiProperty({ required: false, example: [1, 4, 17, 32, 33] })
  @ArrayNotEmpty({ message: PL_ERRORS.VALIDATION_OFFER_BRANCHES })
  @IsInt({ each: true, message: PL_ERRORS.VALIDATION_OFFER_CATEGORIES })
  readonly categories?: number[];
}
