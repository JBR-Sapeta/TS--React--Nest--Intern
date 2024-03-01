import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ required: true, example: 'Password123#' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
