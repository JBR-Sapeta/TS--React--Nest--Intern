import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max, IsOptional, IsInt } from 'class-validator';
import { isNotNil } from 'ramda';
import type { SelectQueryBuilder } from 'typeorm';

export class PaginationParams {
  @ApiProperty({
    minimum: 0,
    default: 0,
    title: 'pageNumber',
    format: 'int',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pageNumber: number = 0;

  @ApiProperty({
    minimum: 0,
    default: 20,
    title: 'limit',
    format: 'int',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}

export function addPaginationParamsToQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  { pageNumber, limit }: PaginationParams,
) {
  if (isNotNil(pageNumber) && isNotNil(limit)) {
    queryBuilder.skip(pageNumber * limit);
    queryBuilder.take(limit);
  }
}
