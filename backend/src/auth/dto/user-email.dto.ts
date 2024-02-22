import { IsEmail } from 'class-validator';

export class UserEmailDto {
  @IsEmail({}, { message: 'Please enter correct email address.' })
  readonly email: string;
}
