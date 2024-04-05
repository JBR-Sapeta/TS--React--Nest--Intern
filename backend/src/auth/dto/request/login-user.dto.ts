import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class LoginUserDto {
  @ApiProperty({ required: true, example: 'user1@mail.com' })
  @IsEmail({}, { message: PL_ERRORS.VALIDATION_EMAIL })
  readonly email: string;

  @ApiProperty({ required: true, example: 'Password123#' })
  @IsNotEmpty({ message: PL_ERRORS.VALIDATION_EMPTY_PASSWORD })
  readonly password: string;
}
