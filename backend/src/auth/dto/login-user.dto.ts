import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: true, example: 'user1@mail.com' })
  @IsEmail({}, { message: 'Please enter correct email address.' })
  readonly email: string;

  @ApiProperty({ required: true, example: 'Password123#' })
  @IsNotEmpty({ message: 'Please enter your password.' })
  readonly password: string;
}
