import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ErrorBucketDto } from './error-bucket.dto';

export class ErrorBucketsDto {
  @ApiProperty({ isArray: true, type: ErrorBucketDto })
  @Expose()
  private buckets: ErrorBucketDto[];

  @ApiProperty({
    example: ['Cannot set headers after they are sent to the client'],
  })
  @Expose()
  private unknownExceptions: string[];

  constructor({
    buckets,
    unknownExceptions,
  }: {
    buckets: ErrorBucketDto[];
    unknownExceptions: string[];
  }) {
    this.buckets = buckets;
    this.unknownExceptions = unknownExceptions;
  }
}
