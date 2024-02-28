import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserEmailDto {
  @ApiProperty({ required: true, example: 'user@mail.com' })
  @IsEmail({}, { message: 'Please enter correct email address.' })
  readonly email: string;
}
