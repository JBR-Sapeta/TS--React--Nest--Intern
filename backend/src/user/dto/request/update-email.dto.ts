import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({ required: true, example: 'newemail@mail.com' })
  @IsEmail({}, { message: 'Please enter correct email address.' })
  readonly newEmail: string;

  @ApiProperty({ required: true, example: 'Password123#' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
