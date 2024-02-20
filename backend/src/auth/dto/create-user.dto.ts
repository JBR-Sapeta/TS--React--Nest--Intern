import {
  IsEmail,
  MinLength,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  @MaxLength(255)
  readonly firstName: string;

  @MinLength(2)
  @MaxLength(255)
  readonly lastName: string;

  @IsEmail({}, { message: '.' })
  @MaxLength(255)
  readonly email: string;

  @IsStrongPassword({ minLength: 8 }, { message: '.' })
  readonly password: string;
}
