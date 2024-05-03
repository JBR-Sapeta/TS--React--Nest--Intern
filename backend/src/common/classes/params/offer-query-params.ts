import { ApiProperty } from '@nestjs/swagger';
import { Min, Max, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OPTIONAL_BOOLEAN_MAP } from '../../constants';
import { SelectQueryBuilder } from 'typeorm';

export class OfferParams {
  @ApiProperty({
    minimum: 0,
    title: 'employmentType',
    description: 'Employment type.',
    format: 'int',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  employmentType?: number;

  @ApiProperty({
    minimum: 0,
    title: 'operatingMode',
    description: 'Operating mode.',
    format: 'int',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  operatingMode?: number;

  @ApiProperty({
    minimum: 0,
    title: 'isPaid',
    description: 'Salary type.',
    format: 'boolean',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
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
