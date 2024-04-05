import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    example: 'eeb122d3-4801-42aa-a74c-3054ff843b59',
  })
  @IsString()
  @IsNotEmpty({ message: PL_ERRORS.VALIDATION_RESET_TOKEN })
  resetToken: string;

  @ApiProperty({
    required: true,
    example: 'Password123$',
  })
  @IsStrongPassword(
    { minLength: 8 },
    { message: PL_ERRORS.VALIDATION_PASSWORD },
  )
  password: string;
}
