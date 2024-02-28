import { IsNotEmpty, IsStrongPassword, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        'Password must contain both uppercase and lowercase letters, one number and special character.',
    },
  )
  readonly newPassword: string;
}
