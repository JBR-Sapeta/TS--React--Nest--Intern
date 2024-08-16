import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { isNotNil, isEmpty } from 'ramda';
import type { SelectQueryBuilder } from 'typeorm';

import { CategoryEntity } from '../../../entity';

export class CategoriesParams {
  @ApiProperty({
    minimum: 0,
    title: 'Categories',
    description: 'Categories list.',
    format: 'string',
    example: '1,2,4,5',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    const data = value.split(',');
    const categories = data.map((category) => parseInt(category));
    return categories.filter((val) => !isNaN(val));
  })
  categories?: number[];
}

export function addCategoriesParamsToCompanyQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  { categories }: CategoriesParams,
) {
  if (isNotNil(categories) && !isEmpty(categories)) {
    queryBuilder.andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(CategoryEntity, 'category')
          .innerJoin('category.companies', 'c', 'c.id = company.id')
          .where('category.id IN (:...categories)')
          .getQuery();
        return `EXISTS ${subQuery}`;
      },
      { categories },
    );
  }
}

export function addCategoriesParamsToOfferQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  { categories }: CategoriesParams,
) {
  if (isNotNil(categories) && !isEmpty(categories)) {
    queryBuilder.andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(CategoryEntity, 'category')
          .innerJoin('category.offers', 'o', 'o.id = offer.id')
          .where('category.id IN (:...categories)')
          .getQuery();
        return `EXISTS ${subQuery}`;
      },
      { categories },
    );
  }
}
