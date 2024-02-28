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

import { UserEntity } from '../entities';
import { UserRepository, UserRoleRepository } from '../repositories';
import { ENV_KEYS } from '../common/constants';
import { Roles } from '../common/enums';
import { SuccessMessageDto } from '../common/classes';
import { calculateExpirationDate } from '../common/functions';

import { MailService } from '../mail/mail.service';

import { AccessTokenDto, RefreshToken, TokensDto } from './dto';
import type { UserEmailDto, CreateUserDto, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async createUserAccount({
    firstName,
    lastName,
    email,
    password,
  }: CreateUserDto): Promise<SuccessMessageDto> {
    const activationToken = uuid();
    const hashedPassword = await this.hashPassword(password);
    const roles = await this.userRoleRepository.getRolesByIds([Roles.USER]);

    await this.userRepository.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      activationToken,
      roles,
    );

    await this.mailService.sendWelcomeEmail(email, firstName, activationToken);

    return new SuccessMessageDto({ statusCode: 201, message: 'Created' });
  }

  // ----------------------------------------------------------------------- \\
  public async login(user: UserEntity): Promise<TokensDto> {
    const refreshToken = await this.createRefreshToken(user.id);
    await this.userRepository.updateRefreshToken(user.id, refreshToken.token);
    const accessToken = await this.createAccessToken(user.id);

    return new TokensDto({}, accessToken, refreshToken);
  }

  // ----------------------------------------------------------------------- \\
  public async logout(userId: string): Promise<SuccessMessageDto> {
    await this.userRepository.updateRefreshToken(userId, null);

    return new SuccessMessageDto({});
  }

  // ----------------------------------------------------------------------- \\
  public async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AccessTokenDto> {
    const user = await this.userRepository.getUserById(userId);

    if (isNil(user) || isNil(user.refreshToken)) {
      throw new ForbiddenException('Access denied.');
    }

    const isValidToken = equals(refreshToken, user.refreshToken);

    if (not(isValidToken)) {
      throw new ForbiddenException('Access denied.');
    }

    const accessToken = await this.createAccessToken(user.id);

    return new AccessTokenDto({}, accessToken);
  }

  // ----------------------------------------------------------------------- \\
  public async activateUserAccount(token: string): Promise<SuccessMessageDto> {
    await this.userRepository.activateAccount(token);

    return new SuccessMessageDto({});
  }

  // ----------------------------------------------------------------------- \\
  public async accountRecovery({
    email,
  }: UserEmailDto): Promise<SuccessMessageDto> {
    const resetToken = uuid();
    const expirationTime = +this.configService.get<string>(
      ENV_KEYS.RESET_TOKEN_EXPIRATION_TIME,
    );
    const resetTokenExpirationDate = calculateExpirationDate(expirationTime);

    const { firstName } = await this.userRepository.setResetToken(
      email,
      resetToken,
      resetTokenExpirationDate,
    );

    await this.mailService.sendRecoveryEmail(email, firstName, resetToken);

    return new SuccessMessageDto({});
  }

  // ----------------------------------------------------------------------- \\
  public async resetPassword({
    resetToken,
    password,
  }: ResetPasswordDto): Promise<SuccessMessageDto> {
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.resetPassword(resetToken, hashedPassword);

    return new SuccessMessageDto({});
  }

  // ----------------------------------------------------------------------- \\
  public async resendWelcomeEmail({
    email,
  }: UserEmailDto): Promise<SuccessMessageDto> {
    const user = await this.userRepository.getUserByEmail(email);

    if (isNil(user)) {
      throw new NotFoundException();
    }

    if (isNil(user.activationToken)) {
      throw new ForbiddenException();
    }

    await this.mailService.sendWelcomeEmail(
      email,
      user.firstName,
      user.activationToken,
    );

    return new SuccessMessageDto({});
  }

  // ----------------------------------------------------------------------- \\
  public async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.getUserByEmail(email);

    if (isNil(user)) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (not(user.isActive)) {
      throw new ForbiddenException('Your account is inactive.');
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (not(isValidPassword)) {
      throw new UnauthorizedException('Invalid credentials.');
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
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValidPassword = await this.verifyPassword(password, user.password);

    if (not(isValidPassword)) {
      throw new UnauthorizedException('Invalid credentials.');
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
  private async createAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>(
          ENV_KEYS.JWT_ACCESS_TOKEN_SECRET,
        ),
        expiresIn: this.configService.get<string>(
          ENV_KEYS.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        ),
      },
    );
  }

  // ------------------------------ Helper ------------------------------- \\
  private async createRefreshToken(userId: string): Promise<RefreshToken> {
    const now = new Date().getTime();
    const expirationTime = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(now + expirationTime).toISOString();
    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>(
          ENV_KEYS.JWT_REFRESH_TOKEN_SECRET,
        ),
        expiresIn: this.configService.get<string>(
          ENV_KEYS.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        ),
      },
    );

    return new RefreshToken(refreshToken, expirationDate);
  }
}
