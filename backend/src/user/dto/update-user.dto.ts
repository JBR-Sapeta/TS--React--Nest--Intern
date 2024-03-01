import { ApiProperty } from '@nestjs/swagger';
import { Length, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: true, example: 'John' })
  @IsOptional()
  @Length(2, 255)
  firstName: string;

  @ApiProperty({ required: true, example: 'Davids' })
  @IsOptional()
  @Length(2, 255)
  lastName: string;

  @ApiProperty({ required: true, example: '735643877' })
  @IsOptional()
  @IsPhoneNumber('PL')
  phoneNumber: string;
}
