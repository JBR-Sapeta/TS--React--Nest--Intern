import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max, IsOptional, IsInt } from 'class-validator';
import { isNotNil } from 'ramda';
import type { SelectQueryBuilder } from 'typeorm';

import { PL_ERRORS } from '../../../locales';

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
  @IsInt({ message: PL_ERRORS.VALIDATION_COMMON_PAGE_NUMBER })
  @Min(0, { message: PL_ERRORS.VALIDATION_COMMON_PAGE_NUMBER })
  pageNumber: number = 0;

  @ApiProperty({
    minimum: 1,
    default: 20,
    title: 'limit',
    format: 'int',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: PL_ERRORS.VALIDATION_COMMON_LIMIT })
  @Min(1, { message: PL_ERRORS.VALIDATION_COMMON_LIMIT })
  @Max(100, { message: PL_ERRORS.VALIDATION_COMMON_LIMIT })
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
