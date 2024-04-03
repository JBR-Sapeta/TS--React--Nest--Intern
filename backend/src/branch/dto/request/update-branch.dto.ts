import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { PL_ERRORS } from '../../../locales';

import { AddressDto } from './address.dto';

export class UpdateBranchDto {
  @IsOptional()
  @ApiProperty({ required: true, example: 'New Company - Boston' })
  @MinLength(4, { message: PL_ERRORS.VALIDATION_BRANCH_NAME })
  @MaxLength(255, { message: PL_ERRORS.VALIDATION_BRANCH_NAME })
  readonly name?: string;

  @IsOptional()
  @ApiProperty({ required: true, type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  readonly address?: AddressDto;
}
