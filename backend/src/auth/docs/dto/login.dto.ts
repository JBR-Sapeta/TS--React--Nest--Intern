import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true, example: 'user@mail.com' })
  readonly email: string;

  @ApiProperty({ required: true, example: 'Password123#' })
  readonly password: string;
}
