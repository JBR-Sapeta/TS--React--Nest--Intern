import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsEmail, IsBoolean, Matches } from 'class-validator';
import type { SelectQueryBuilder } from 'typeorm';

import { PL_ERRORS } from '../../../locales';
import { OPTIONAL_BOOLEAN_MAP } from '../../../common/constants';

export class UserParams {
  @ApiProperty({
    title: 'firstName',
    description: 'First name',
    format: 'string',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @Matches(/^[A-Z][a-zA-Z\s]+/, {
    message: PL_ERRORS.VALIDATION_COMMON_STRING_ALPHABETIC,
  })
  firstName?: string;

  @ApiProperty({
    title: 'lastName',
    description: 'Last name.',
    format: 'string',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @Matches(/^[A-Z][a-zA-Z\s]+/, {
    message: PL_ERRORS.VALIDATION_COMMON_STRING_ALPHABETIC,
  })
  lastName?: string;

  @ApiProperty({
    title: 'email',
    description: 'User email.',
    format: 'string',
    example: 'user@mail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: PL_ERRORS.VALIDATION_COMMON_EMAIL })
  email?: string;

  @ApiProperty({
    title: 'hasBan',
    description: 'User account status.',
    format: 'boolean',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: PL_ERRORS.VALIDATION_COMMON_BOOLEAN })
  @Transform(({ value }) => OPTIONAL_BOOLEAN_MAP.get(value))
  hasBan?: boolean;
}

export function addUserParamsToQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  user: UserParams,
) {
  const { firstName, lastName, email, hasBan } = user;

  if (firstName) {
    queryBuilder.andWhere('user.first_name = :firstName', { firstName });
  }

  if (lastName) {
    queryBuilder.andWhere('user.last_name = :lastName', { lastName });
  }

  if (email) {
    queryBuilder.andWhere('user.email = :email', { email });
  }

  if (typeof hasBan === 'boolean') {
    queryBuilder.andWhere('user.has_ban = :hasBan', { hasBan });
  }
}
