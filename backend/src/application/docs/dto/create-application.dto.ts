import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

import { PL_ERRORS } from '../../../locales';

export class CreateApplicationDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: any;

  @ApiProperty({ required: false, example: 'Optional message to employer...' })
  @MaxLength(512, { message: PL_ERRORS.VALIDATION_APPLICATION_MESSAGE })
  readonly message: string;
}
