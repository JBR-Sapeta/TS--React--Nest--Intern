import { ApiProperty } from '@nestjs/swagger';
import { Min, Max, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';

import { OPTIONAL_BOOLEAN_MAP } from '../../constants';
import { PL_ERRORS } from '../../../locales';

export class OfferParams {
  @ApiProperty({
    minimum: 0,
    title: 'employmentType',
    description: 'Employment type.',
    format: 'int',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  @Min(1, { message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  @Max(5, { message: PL_ERRORS.VALIDATION_OFFER_EMPLOYMENT_TYPE })
  employmentType?: number;

  @ApiProperty({
    minimum: 0,
    title: 'operatingMode',
    description: 'Operating mode.',
    format: 'int',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  @Min(1, { message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  @Max(3, { message: PL_ERRORS.VALIDATION_OFFER_OPERATING_MODE })
  operatingMode?: number;

  @ApiProperty({
    minimum: 0,
    title: 'isPaid',
    description: 'Salary type.',
    format: 'boolean',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: PL_ERRORS.VALIDATION_OFFER_IS_PAID })
  @Transform(({ value }) => OPTIONAL_BOOLEAN_MAP.get(value))
  isPaid?: boolean;
}

export function addOfferParamsToQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  offer: OfferParams,
) {
  const { employmentType, operatingMode, isPaid } = offer;

  if (employmentType) {
    queryBuilder.andWhere('offer.employment_type_id = :employmentType', {
      employmentType,
    });
  }

  if (operatingMode) {
    queryBuilder.andWhere('offer.operating_mode_id = :operatingMode', {
      operatingMode,
    });
  }

  if (isPaid === true || isPaid === false) {
    queryBuilder.andWhere('offer.is_paid = :isPaid', { isPaid });
  }
}
