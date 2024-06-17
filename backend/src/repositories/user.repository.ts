import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { isNil } from 'ramda';

import { UserEntity, RoleEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import { PostgresqlErrorCode } from '../common/enums';
import type { Nullable } from '../common/types';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
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
    roles: RoleEntity[],
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
      this.logger.error(UserRepository.name + ' - createUser', error.stack);

      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(PL_ERRORS.CONFLICT_EMAIL_TAKEN);
      }

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateUserProfile(
    userId: string,
    fieldsToUpdate: Partial<UserEntity>,
  ): Promise<UserEntity> {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOne({ where: { id: userId } });
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - updateUserProfile',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    if (isNil(user)) {
      throw new BadRequestException(PL_ERRORS.FORBIDDEN);
    }

    try {
      Object.assign(user, fieldsToUpdate);
      const updatedUser = await this.save(user);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - updateUserProfile',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateUser(
    user: UserEntity,
    fieldsToUpdate: Partial<UserEntity>,
  ): Promise<UserEntity> {
    try {
      Object.assign(user, fieldsToUpdate);
      const updatedUser = await this.save(user);
      return updatedUser;
    } catch (error) {
      this.logger.error(UserRepository.name + ' - updateUser', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateUserTransaction(
    user: UserEntity,
    fieldsToUpdate: Partial<UserEntity>,
    queryRunner: QueryRunner,
  ): Promise<UserEntity> {
    try {
      Object.assign(user, fieldsToUpdate);
      const updatedUser = await queryRunner.manager.save(UserEntity, user);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - updateUserTransaction',
        error.stack,
      );

      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(PL_ERRORS.CONFLICT_EMAIL_TAKEN);
      }
      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  // @ TO DO - Refactor
  public async updateUserEmail(
    user: UserEntity,
    email: string,
  ): Promise<UserEntity> {
    try {
      user.email = email;
      const updatedUser = await this.save(user);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - updateUserEmail',
        error.stack,
      );

      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(PL_ERRORS.CONFLICT_EMAIL_TAKEN);
      }
      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  // @ TO DO - Refactor
  public async updateUserPassword(
    user: UserEntity,
    password: string,
  ): Promise<void> {
    try {
      user.password = password;
      await this.save(user);
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - updateUserPassword',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  // @ TO DO - Refactor
  public async updateRefreshToken(
    userId: string,
    refreshToken: Nullable<string>,
  ): Promise<void> {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOneBy({ id: userId });
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - updateRefreshToken',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    if (isNil(user)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    try {
      user.refreshToken = refreshToken;
      await this.save(user);
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - updateRefreshToken',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getUserById(userId: string): Promise<Nullable<UserEntity>> {
    try {
      const user = await this.findOne({ where: { id: userId } });
      return user;
    } catch (error) {
      this.logger.error(UserRepository.name + ' - getUserById', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getUserByEmail(email: string): Promise<Nullable<UserEntity>> {
    try {
      const user = await this.findOne({ where: { email } });
      return user;
    } catch (error) {
      this.logger.error(UserRepository.name + ' - getUserByEmail', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
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
      this.logger.error(UserRepository.name + ' - setResetToken', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    if (isNil(user)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    try {
      user.resetToken = resetToken;
      user.resetTokenExpirationDate = resetTokenExpirationDate;
      const updatedUser = await this.save(user);
      return updatedUser;
    } catch (error) {
      this.logger.error(UserRepository.name + ' - setResetToken', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async activateAccount(activationToken: string): Promise<void> {
    let user: Nullable<UserEntity> = null;

    try {
      user = await this.findOneBy({ activationToken });
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - activateAccount',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    if (isNil(user)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_ACCOUNT_ACTIVATION);
    }

    try {
      user.activationToken = null;
      user.isActive = true;
      await this.save(user);
    } catch (error) {
      this.logger.error(
        UserRepository.name + ' - activateAccount',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
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
      this.logger.error(UserRepository.name + ' - resetPassword', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    if (isNil(user)) {
      throw new ForbiddenException(PL_ERRORS.NOT_FUOND_USER);
    }

    const now = new Date().getTime();
    const expirationDate = new Date(user.resetTokenExpirationDate).getTime();

    if (now > expirationDate) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_RESET_TOKEN);
    }

    try {
      user.resetToken = null;
      user.resetTokenExpirationDate = null;
      user.password = password;
      await this.save(user);
    } catch (error) {
      this.logger.error(UserRepository.name + ' - resetPassword', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteUser(userId: string): Promise<void> {
    try {
      await this.delete({ id: userId });
    } catch (error) {
      this.logger.error(UserRepository.name + ' - deleteUser', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
