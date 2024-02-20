import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'ramda';

import { UserEntity, UserRoleEntity } from '../entities';
import { PostgresqlErrorCodes } from '../common/enums';
import type { Nullable } from '../common/types';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    activationToken: string,
    roles: UserRoleEntity[],
  ): Promise<UserEntity> {
    const user = this.create({
      firstName,
      lastName,
      email,
      password,
      activationToken,
      roles,
    });

    try {
      const createdUser = await this.save(user);
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresqlErrorCodes.UNIQUE_VIOLATION) {
        throw new ConflictException('Email already in use.');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  public async getUserById(userId: string): Promise<Nullable<UserEntity>> {
    try {
      const user = await this.findOneBy({ id: userId });
      return user;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  public async getUserByEmail(email: string): Promise<Nullable<UserEntity>> {
    try {
      const user = await this.findOneBy({ email });
      return user;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  public async updateRefreshToken(
    userId: string,
    refreshToken: Nullable<string>,
  ) {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOneBy({ id: userId });
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }

    if (isNil(user)) {
      throw new ForbiddenException('This account does not exist.');
    }

    try {
      user.refreshToken = refreshToken;
      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async activateAccount(activationToken: string) {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOneBy({ activationToken });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (isNil(user)) {
      throw new ForbiddenException(
        'This account is either active or provided token is invalid.',
      );
    }

    try {
      user.activationToken = null;
      user.isActive = true;
      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
