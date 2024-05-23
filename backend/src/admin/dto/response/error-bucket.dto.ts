import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ErrorType } from '../../utils';
import { ErrorDto } from './error.dto';
import { isNil } from 'ramda';

export class ErrorBucketDto {
  @ApiProperty({ example: 'MailService' })
  @Expose()
  private name: string;

  @ApiProperty({ example: 24 })
  @Expose()
  private standardErrorsCount: number;

  @ApiProperty({ example: 37 })
  @Expose()
  private forbiddenErrorsCount: number;

  @ApiProperty({ example: 6 })
  @Expose()
  private fileErrorsCount: number;

  @ApiProperty({ isArray: true, type: ErrorDto })
  @Expose()
  private standardErrors: ErrorDto[];

  @ApiProperty({ isArray: true, type: ErrorDto })
  @Expose()
  private forbiddenErrors: ErrorDto[];

  @ApiProperty({ isArray: true, type: ErrorDto })
  @Expose()
  private fileErrors: ErrorDto[];

  constructor(name: string) {
    this.name = name;
    this.standardErrorsCount = 0;
    this.standardErrors = [];
    this.forbiddenErrorsCount = 0;
    this.forbiddenErrors = [];
    this.fileErrorsCount = 0;
    this.fileErrors = [];
  }

  public pushError(error: ErrorDto) {
    if (error.type === ErrorType.STANDARD) {
      const errorInArray = this.standardErrors.find((e) => e.compare(error));

      if (!isNil(errorInArray)) {
        errorInArray.incrementCounter();
      } else {
        this.standardErrors.push(error);
      }

      this.standardErrorsCount += 1;
    }

    if (error.type === ErrorType.FORBIDDEN) {
      const errorInArray = this.forbiddenErrors.find((e) => e.compare(error));

      if (!isNil(errorInArray)) {
        errorInArray.incrementCounter();
      } else {
        this.forbiddenErrors.push(error);
      }

      this.forbiddenErrorsCount += 1;
    }

    if (error.type === ErrorType.FILE_OPERATION) {
      const errorInArray = this.fileErrors.find((e) => e.compare(error));

      if (!isNil(errorInArray)) {
        errorInArray.incrementCounter();
      } else {
        this.fileErrors.push(error);
      }

      this.fileErrorsCount += 1;
    }
  }
}
