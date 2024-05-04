import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export type PaginationArgs = {
  pageNumber: number;
  limit: number;
  count: number;
  message?: string;
  statusCode?: number;
};

export class PaginationDto {
  @ApiProperty({ example: 200 })
  @Expose()
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  @Expose()
  message: string;

  @ApiProperty({ type: () => typeof null, example: null })
  @Expose()
  error: null;

  @ApiProperty({ example: 20 })
  @Expose()
  limit: number;

  @ApiProperty({ example: 12 })
  @Expose()
  pageNumber: number;

  @ApiProperty({ example: true })
  @Expose()
  hasNextPage: boolean;

  @ApiProperty({ example: 241 })
  @Expose()
  totalPages: number;

  constructor({
    limit,
    pageNumber,
    count,
    message = 'Succes',
    statusCode = 200,
  }: PaginationArgs) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = null;
    this.limit = limit;
    this.pageNumber = pageNumber;
    this.hasNextPage = count - pageNumber * limit - limit > 0;
    this.totalPages = Math.ceil(count / limit);
  }
}
