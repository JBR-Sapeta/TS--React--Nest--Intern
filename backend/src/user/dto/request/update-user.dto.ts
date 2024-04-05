import { ApiProperty } from '@nestjs/swagger';
import { Length, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  @Length(2, 255)
  firstName: string;

  @ApiProperty({ example: 'Davids' })
  @IsOptional()
  @Length(2, 255)
  lastName: string;

  @ApiProperty({ example: '735643877' })
  @IsOptional()
  @IsPhoneNumber('PL')
  phoneNumber: string;
}
