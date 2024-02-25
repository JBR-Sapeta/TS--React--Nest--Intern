import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'ramda';

import { UserEntity, UserRoleEntity } from '../entities';
import { PostgresqlErrorCode } from '../common/enums';
import type { Nullable } from '../common/types';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
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
      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException('Email already in use.');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateUserProfile(
    userId: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ): Promise<UserEntity> {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOne({
        where: { id: userId },
        relations: { roles: true },
      });
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }

    if (isNil(user)) {
      throw new ForbiddenException('This account does not exist.');
    }

    try {
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      return this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateUserEmail(
    user: UserEntity,
    email: string,
  ): Promise<UserEntity> {
    try {
      user.email = email;
      const updatedUser = await this.save(user);
      return updatedUser;
    } catch (error) {
      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException('Email already in use.');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateUserPassword(
    user: UserEntity,
    password: string,
  ): Promise<void> {
    try {
      user.password = password;
      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateRefreshToken(
    userId: string,
    refreshToken: Nullable<string>,
  ): Promise<void> {
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

  // ----------------------------------------------------------------------- \\
  public async getUserById(userId: string): Promise<Nullable<UserEntity>> {
    try {
      const user = await this.findOne({
        where: { id: userId },
        relations: { roles: true },
      });
      return user;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getUserByEmail(email: string): Promise<Nullable<UserEntity>> {
    try {
      const user = await this.findOne({
        where: { email },
        relations: { roles: true },
      });
      return user;
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // ----------------------------------------------------------------------- \\
  public async setResetToken(
    email: string,
    resetToken: string,
    resetTokenExpirationDate: Date,
  ): Promise<UserEntity> {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOneBy({ email });
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }

    if (isNil(user)) {
      throw new NotFoundException('This account does not exist.');
    }

    try {
      user.resetToken = resetToken;
      user.resetTokenExpirationDate = resetTokenExpirationDate;
      return this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // ----------------------------------------------------------------------- \\
  public async activateAccount(activationToken: string): Promise<void> {
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

  // ----------------------------------------------------------------------- \\
  public async resetPassword(
    resetToken: string,
    password: string,
  ): Promise<void> {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOneBy({ resetToken });
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }

    if (isNil(user)) {
      throw new ForbiddenException();
    }

    const now = new Date().getTime();
    const expirationDate = new Date(user.resetTokenExpirationDate).getTime();

    if (now > expirationDate) {
      throw new ForbiddenException();
    }

    try {
      user.resetToken = null;
      user.resetTokenExpirationDate = null;
      user.password = password;
      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteUser(userId: string): Promise<void> {
    try {
      await this.delete({ id: userId });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
