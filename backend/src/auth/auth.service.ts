import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { equals, isNil } from 'ramda';

import { RoleEntity, UserEntity } from '../entity';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import { UserRepository, RoleRepository } from '../repository';
import { ENV_KEYS } from '../common/constants';
import { SuccessMessageDto } from '../common/classes';
import { Roles } from '../common/enums';
import { calculateDate } from '../common/functions';
import { Nullable, CachedUserData } from '../common/types';

import { CacheService } from '../cache/cache.service';
import { MailService } from '../mail/mail.service';

import { AccessTokenDto, RefreshTokenDto, TokensDto } from './dto/response';
import type {
  UserEmailDto,
  CreateUserDto,
  ResetPasswordDto,
  LoginUserDto,
} from './dto/request';

@Injectable()
export class AuthService {
  private cacheExpirationTime = 1200;
  private accessTokenSecret: string;
  private accessTokenExpirationTime: string;
  private refreshTokenSecret: string;
  private refreshTokenExpirationTime: string;
  private resetTokenExpiartionTime: number;

  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      ENV_KEYS.JWT_ACCESS_TOKEN_SECRET,
    );
    this.accessTokenExpirationTime = this.configService.get<string>(
      ENV_KEYS.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    );
    this.refreshTokenSecret = this.configService.get<string>(
      ENV_KEYS.JWT_REFRESH_TOKEN_SECRET,
    );
    this.refreshTokenExpirationTime = this.configService.get<string>(
      ENV_KEYS.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    );
    this.resetTokenExpiartionTime = +this.configService.get<string>(
      ENV_KEYS.RESET_TOKEN_EXPIRATION_TIME,
    );
  }

  // ----------------------------------------------------------------------- \\
  public async createUserAccount({
    firstName,
    lastName,
    email,
    password,
  }: CreateUserDto): Promise<SuccessMessageDto> {
    const activationToken = uuid();
    const hashedPassword = await this.hashPassword(password);
    const roles = await this.roleRepository.getRolesByIds([Roles.USER]);

    await this.userRepository.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      activationToken,
      roles,
    );

    await this.mailService.sendWelcomeEmail(email, firstName, activationToken);

    return new SuccessMessageDto({
      statusCode: 201,
      message: PL_MESSAGES.AUTH_ACCOUNT_CREATED,
    });
  }

  // ----------------------------------------------------------------------- \\
  public async login({ email, password }: LoginUserDto): Promise<TokensDto> {
    const { id, roles, isActive, hasBan } = await this.validateUserCredentials(
      email,
      password,
    );

    if (!isActive) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INACTIVE_ACCOUNT);
    }

    if (hasBan) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_ACCOUNT_SUSPENDED);
    }

    const refreshToken = await this.createRefreshToken(id);
    await this.userRepository.updateRefreshToken(id, refreshToken.token);
    const accessToken = await this.createAccessToken(id, roles);

    await this.cacheService.setData(
      id,
      { id, roles, refreshToken: refreshToken.token },
      this.cacheExpirationTime,
    );

    return new TokensDto(
      { message: PL_MESSAGES.AUTH_LOGGED_IN },
      accessToken,
      refreshToken,
    );
  }

  // ----------------------------------------------------------------------- \\
  public async logout(userId: string): Promise<SuccessMessageDto> {
    await this.userRepository.updateRefreshToken(userId, null);
    await this.cacheService.removeData(userId);

    return new SuccessMessageDto({ message: PL_MESSAGES.AUTH_LOGGED_OUT });
  }

  // ----------------------------------------------------------------------- \\
  public async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AccessTokenDto> {
    let userData: Nullable<CachedUserData> = null;

    userData = await this.cacheService.getData<CachedUserData>(userId);

    if (isNil(userData)) {
      const user = await this.userRepository.getUserById(userId);

      if (!isNil(user)) {
        const { id, roles, refreshToken } = user;
        userData = { id, roles, refreshToken };
      }
    }

    if (isNil(userData) || isNil(userData.refreshToken)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const isValidToken = equals(refreshToken, userData.refreshToken);

    if (!isValidToken) {
      this.logger.error(
        AuthService.name + ' - refreshToken',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const accessToken = await this.createAccessToken(userId, userData.roles);

    await this.cacheService.setData(userId, userData, this.cacheExpirationTime);

    return new AccessTokenDto(
      { message: PL_MESSAGES.BASE_SUCCESS },
      accessToken,
    );
  }

  // ----------------------------------------------------------------------- \\
  public async activateUserAccount(token: string): Promise<SuccessMessageDto> {
    await this.userRepository.activateAccount(token);

    return new SuccessMessageDto({
      message: PL_MESSAGES.AUTH_ACCOUNT_ACTIVATION,
    });
  }

  // ----------------------------------------------------------------------- \\
  public async accountRecovery({
    email,
  }: UserEmailDto): Promise<SuccessMessageDto> {
    const resetToken = uuid();

    const resetTokenExpirationDate = calculateDate(
      this.resetTokenExpiartionTime,
    );

    const { firstName } = await this.userRepository.setResetToken(
      email,
      resetToken,
      resetTokenExpirationDate,
    );

    await this.mailService.sendRecoveryEmail(email, firstName, resetToken);

    return new SuccessMessageDto({
      message: PL_MESSAGES.AUTH_ACCOUNT_RECOVERY,
    });
  }

  // ----------------------------------------------------------------------- \\
  public async resetPassword({
    resetToken,
    password,
  }: ResetPasswordDto): Promise<SuccessMessageDto> {
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.resetPassword(resetToken, hashedPassword);

    return new SuccessMessageDto({ message: PL_MESSAGES.AUTH_PASSWORD_RESET });
  }

  // ----------------------------------------------------------------------- \\
  public async resendWelcomeEmail({
    email,
  }: UserEmailDto): Promise<SuccessMessageDto> {
    const user = await this.userRepository.getUserByEmail(email);

    if (isNil(user)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_USER);
    }

    if (isNil(user.activationToken)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    await this.mailService.sendWelcomeEmail(
      email,
      user.firstName,
      user.activationToken,
    );

    return new SuccessMessageDto({
      message: PL_MESSAGES.AUTH_RESEND_ACTIVATION_EMAIL,
    });
  }

  // ----------------------------------------------------------------------- \\
  public async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.getUserByEmail(email);

    if (isNil(user)) {
      throw new UnauthorizedException(
        PL_ERRORS.UNAUTHORIZED_INVALID_CREDENTIALS,
      );
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(
        PL_ERRORS.UNAUTHORIZED_INVALID_CREDENTIALS,
      );
    }

    return user;
  }

  // ----------------------------------------------------------------------- \\
  public async validateUserPassword(
    userId: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.getUserById(userId);

    if (isNil(user)) {
      throw new UnauthorizedException(PL_ERRORS.UNAUTHORIZED_INVALID_PASSWORD);
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(PL_ERRORS.UNAUTHORIZED_INVALID_PASSWORD);
    }

    return user;
  }

  // ------------------------------ Helper ------------------------------- \\
  public async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }

  // ------------------------------ Helper ------------------------------- \\
  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(password, hash);
    return isValidPassword;
  }

  // ------------------------------ Helper ------------------------------- \\
  private async createAccessToken(
    userId: string,
    roles: RoleEntity[],
  ): Promise<string> {
    return this.jwtService.signAsync(
      { userId, roles },
      {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExpirationTime,
      },
    );
  }

  // ------------------------------ Helper ------------------------------- \\
  private async createRefreshToken(userId: string): Promise<RefreshTokenDto> {
    const now = new Date().getTime();
    const expirationTime = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(now + expirationTime).toISOString();
    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExpirationTime,
      },
    );

    return new RefreshTokenDto(refreshToken, expirationDate);
  }
}
