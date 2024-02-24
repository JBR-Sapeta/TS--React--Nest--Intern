import { Length, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 255)
  firstName: string;

  @IsOptional()
  @Length(2, 255)
  lastName: string;

  @IsOptional()
  @IsPhoneNumber('PL')
  phoneNumber: string;
}
