import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

import { PL_ERRORS } from '../../locales';

export class UserEmailDto {
  @ApiProperty({ required: true, example: 'user@mail.com' })
  @IsEmail({}, { message: PL_ERRORS.VALIDATION_EMAIL })
  readonly email: string;
}
