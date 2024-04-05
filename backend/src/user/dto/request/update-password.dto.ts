import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ required: true, example: 'Password123#' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ required: true, example: 'NewPassword123$' })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        'Password must contain both uppercase and lowercase letters, one number and special character.',
    },
  )
  readonly newPassword: string;
}
