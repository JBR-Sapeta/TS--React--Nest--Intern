import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail({}, { message: 'Please enter correct email address.' })
  readonly newEmail: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
