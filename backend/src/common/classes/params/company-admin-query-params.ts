import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';
import type { SelectQueryBuilder } from 'typeorm';

import { OPTIONAL_BOOLEAN_MAP } from '../../constants';
import { PL_ERRORS } from '../../../locales';

export class CompanyAdminParams {
  @ApiProperty({
    title: 'owner',
    description: 'Show company owner.',
    format: 'boolean',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: PL_ERRORS.VALIDATION_COMMON_BOOLEAN })
  @Transform(({ value }) => OPTIONAL_BOOLEAN_MAP.get(value))
  owner?: boolean;

  @ApiProperty({
    title: 'isVerified',
    description: 'Company verification status.',
    format: 'boolean',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: PL_ERRORS.VALIDATION_COMMON_BOOLEAN })
  @Transform(({ value }) => OPTIONAL_BOOLEAN_MAP.get(value))
  isVerified?: boolean;
}

export function addCompanyAdminParamsToQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  company: CompanyAdminParams,
) {
  const { isVerified } = company;

  if (typeof isVerified === 'boolean') {
    queryBuilder.andWhere('company.is_verified = :isVerified', { isVerified });
  }
}

export function joinUserBaseOnCompanyAdminParams<T>(
  queryBuilder: SelectQueryBuilder<T>,
  company: CompanyAdminParams,
) {
  const { owner } = company;

  if (owner === true) {
    queryBuilder.leftJoinAndSelect('company.user', 'user');
  }
}
