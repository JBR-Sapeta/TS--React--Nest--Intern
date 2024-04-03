import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

import { PL_ERRORS } from '../../locales';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'John' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_FIRST_NAME })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_FIRST_NAME })
  readonly firstName: string;

  @ApiProperty({ required: true, example: 'Smith' })
  @MinLength(2, { message: PL_ERRORS.VALIDATION_LAST_NAME })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_LAST_NAME })
  readonly lastName: string;

  @ApiProperty({ required: true, example: 'user@mail.com' })
  @IsEmail({}, { message: PL_ERRORS.VALIDATION_EMAIL })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_EMAIL })
  readonly email: string;

  @ApiProperty({ required: true, example: 'Password123#' })
  @IsStrongPassword(
    { minLength: 8 },
    { message: PL_ERRORS.VALIDATION_PASSWORD },
  )
  readonly password: string;
}
