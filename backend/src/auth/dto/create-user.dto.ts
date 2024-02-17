import { IsEmail, MinLength, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  readonly firstName: string;

  @MinLength(2)
  readonly lastName: string;

  @IsEmail({}, { message: '.' })
  readonly email: string;

  @IsStrongPassword({ minLength: 8 }, { message: '.' })
  readonly password: string;
}
