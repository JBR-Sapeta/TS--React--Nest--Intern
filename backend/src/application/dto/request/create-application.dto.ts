import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class CreateApplicationDto {
  @ApiProperty({ required: false, example: 'Optional message to employer...' })
  @MaxLength(512, { message: PL_ERRORS.VALIDATION_APPLICATION_MESSAGE })
  readonly message: string;
}
