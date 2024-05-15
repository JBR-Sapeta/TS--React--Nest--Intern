import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { equals, isNil, not } from 'ramda';

import { RoleEntity, UserEntity } from '../entities';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import { UserRepository, RoleRepository } from '../repositories';
import { ENV_KEYS } from '../common/constants';
import { Roles } from '../common/enums';
import { SuccessMessageDto } from '../common/classes';
import { calculateDate } from '../common/functions';

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
  private accessTokenSecret: string;
  private accessTokenExpirationTime: string;
  private refreshTokenSecret: string;
  private refreshTokenExpirationTime: string;
  private resetTokenExpiartionTime: number;

  constructor(
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
    const user = await this.validateUserCredentials(email, password);
    const refreshToken = await this.createRefreshToken(user.id);
    await this.userRepository.updateRefreshToken(user.id, refreshToken.token);
    const accessToken = await this.createAccessToken(user.id, user.roles);

    return new TokensDto(
      { message: PL_MESSAGES.AUTH_LOGGED_IN },
      accessToken,
      refreshToken,
    );
  }

  // ----------------------------------------------------------------------- \\
  public async logout(userId: string): Promise<SuccessMessageDto> {
    await this.userRepository.updateRefreshToken(userId, null);

    return new SuccessMessageDto({ message: PL_MESSAGES.AUTH_LOGGED_OUT });
  }

  // ----------------------------------------------------------------------- \\
  public async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AccessTokenDto> {
    const user = await this.userRepository.getUserById(userId);

    if (isNil(user) || isNil(user.refreshToken)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const isValidToken = equals(refreshToken, user.refreshToken);

    if (not(isValidToken)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const accessToken = await this.createAccessToken(user.id, user.roles);

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

    if (not(user.isActive)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INACTIVE_ACCOUNT);
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (not(isValidPassword)) {
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

    if (not(isValidPassword)) {
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
