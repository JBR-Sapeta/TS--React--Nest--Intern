import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class ResetCompanyImagesDto {
  @ApiProperty({ required: true, example: true })
  @IsOptional()
  @IsBoolean({ message: PL_ERRORS.VALIDATION_COMMON_BOOLEAN })
  readonly logoUrl?: boolean;

  @ApiProperty({ required: true, example: false })
  @IsOptional()
  @IsBoolean({ message: PL_ERRORS.VALIDATION_COMMON_BOOLEAN })
  readonly mainPhotoUrl?: boolean;
}
