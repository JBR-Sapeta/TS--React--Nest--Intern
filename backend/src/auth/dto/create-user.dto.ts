import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'John' })
  @MinLength(2)
  @MaxLength(255)
  readonly firstName: string;

  @ApiProperty({ required: true, example: 'Smith' })
  @MinLength(2)
  @MaxLength(255)
  readonly lastName: string;

  @ApiProperty({ required: true, example: 'user@mail.com' })
  @IsEmail({}, { message: '.' })
  @MaxLength(255)
  readonly email: string;

  @ApiProperty({ required: true, example: 'Password123#' })
  @IsStrongPassword({ minLength: 8 }, { message: '.' })
  readonly password: string;
}
