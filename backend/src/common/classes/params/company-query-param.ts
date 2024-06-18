import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, IsEmail } from 'class-validator';
import type { SelectQueryBuilder } from 'typeorm';

import { PL_ERRORS } from '../../../locales';

export class CompanyParams {
  @ApiProperty({
    title: 'name',
    description: 'Company name.',
    format: 'string',
    example: 'New Company',
    required: false,
  })
  @IsOptional()
  @IsString({ message: PL_ERRORS.VALIDATION_COMMON_STRING })
  name?: string;

  @ApiProperty({
    title: 'city',
    description: 'City.',
    format: 'string',
    example: 'Warsaw',
    required: false,
  })
  @IsOptional()
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: PL_ERRORS.VALIDATION_COMPANY_SLUG,
  })
  slug?: string;

  @ApiProperty({
    title: 'email',
    description: 'Company email.',
    format: 'string',
    example: 'newcompany@mail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: PL_ERRORS.VALIDATION_COMMON_EMAIL })
  email?: string;
}

export function addCompanyParamsToQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  company: CompanyParams,
) {
  const { name, slug, email } = company;

  if (name) {
    queryBuilder.andWhere('company.name = :name', { name });
  }

  if (slug) {
    queryBuilder.andWhere('company.slug = :slug', { slug });
  }

  if (email) {
    queryBuilder.andWhere('company.email = :email', { email });
  }
}
