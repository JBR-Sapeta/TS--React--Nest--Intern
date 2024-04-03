import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MaxLength, MinLength, ValidateNested } from 'class-validator';

import { PL_ERRORS } from '../../../locales';

import { AddressDto } from './address.dto';

export class CreateBranchDto {
  @ApiProperty({ required: true, example: 'New Company - Boston' })
  @MinLength(4, { message: PL_ERRORS.VALIDATION_BRANCH_NAME })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_BRANCH_NAME })
  readonly name: string;

  @ApiProperty({ required: true, type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  readonly address: AddressDto;
}
