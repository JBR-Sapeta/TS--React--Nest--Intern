import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsPositive,
} from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class CreateCompanyDto {
  @ApiProperty({ required: true, example: 'New Company' })
  @MinLength(1, { message: PL_ERRORS.VALIDATION_COMPANY_NAME })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_COMPANY_NAME })
  readonly name: string;

  @ApiProperty({ required: true, example: 'new-company' })
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: PL_ERRORS.VALIDATION_COMPANY_SLUG,
  })
  @MinLength(1, { message: PL_ERRORS.VALIDATION_COMPANY_SLUG_SIZE })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_COMPANY_SLUG_SIZE })
  readonly slug: string;

  @ApiProperty({ required: true, example: 'newcomapny@mail.com' })
  @IsEmail({}, { message: PL_ERRORS.VALIDATION_EMAIL })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_EMAIL })
  readonly email: string;

  @ApiProperty({ required: true, example: 'Comapny Description' })
  @MinLength(32, { message: PL_ERRORS.VALIDATION_COMPANY_DESCRIPTION })
  readonly description: string;

  @ApiProperty({ required: true, example: 100 })
  @IsPositive({ message: PL_ERRORS.VALIDATION_COMPANY_SIZE })
  readonly size: number;
}
