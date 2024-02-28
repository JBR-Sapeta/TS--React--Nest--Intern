import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    example: 'eeb122d3-4801-42aa-a74c-3054ff843b59',
  })
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty({
    required: true,
    example: 'Password123$',
  })
  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        'Password must contain both uppercase and lowercase letters, one number and special character.',
    },
  )
  password: string;
}
