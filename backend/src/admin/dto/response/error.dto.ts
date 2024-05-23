import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { ErrorType } from '../../utils';

export class ErrorDto {
  @ApiProperty({ example: ErrorType.STANDARD })
  @Expose()
  @IsEnum(ErrorType)
  public type: ErrorType;

  @ApiProperty({ example: 'global' })
  @Expose()
  public context: string;

  @ApiProperty({
    example: `Cannot save file to s3`,
  })
  @Expose()
  public message: string;

  @ApiProperty({ example: null })
  @Expose()
  data: string | null;

  @ApiProperty({ example: 22 })
  @Expose()
  public count: number;

  constructor({
    type = ErrorType.STANDARD,
    context = 'global',
    message = 'error',
    data = null,
  }) {
    this.type = type;
    this.context = context;
    this.message = message;
    this.data = data;
    this.count = 1;
  }

  public incrementCounter() {
    this.count += 1;
  }

  public compare(object: ErrorDto): boolean {
    return (
      this.type === object.type &&
      this.context === object.context &&
      this.message === object.message &&
      this.data === object.data
    );
  }
}
