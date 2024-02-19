import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { isNil, not } from 'ramda';

import { ENV_KEYS } from '../common/constants';
import { SuccesMessage } from '../common/classes';

import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';

import { AccessTokenDto, RefreshToken, TokensDto, ProfileDto } from './dto';
import type { CreateUserDto } from './dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly userRepository: UserRepository,
  ) {}

  public async createUserAccount(
    createUserDto: CreateUserDto,
  ): Promise<SuccesMessage> {
    const { firstName, lastName, email, password } = createUserDto;
    const activationToken = uuid();
    const hashedPassword = await bcrypt.hash(password, 12);

    await this.userRepository.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      activationToken,
    );

    await this.mailService.sendWelcomeEmail(email, firstName, activationToken);

    return new SuccesMessage({ statusCode: 201 });
  }

  public async login(user: UserEntity): Promise<TokensDto> {
    const refreshToken = await this.createRefreshToken(user.id);
    const hashedRefreshToken = await bcrypt.hash(refreshToken.token, 10);
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);
    const accessToken = await this.createAccessToken(user.id);

    return new TokensDto({}, accessToken, refreshToken);
  }

  public async logout(userId: string): Promise<SuccesMessage> {
    await this.userRepository.updateRefreshToken(userId, null);

    return new SuccesMessage({});
  }

  public async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AccessTokenDto> {
    const user = await this.userRepository.getUserById(userId);

    if (isNil(user) || isNil(user.refreshToken)) {
      throw new ForbiddenException('Access Denied');
    }

    const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);

    if (not(isValidToken)) {
      throw new ForbiddenException('Access Denied');
    }

    const accessToken = await this.createAccessToken(user.id);

    return new AccessTokenDto({}, accessToken);
  }

  public async getUserProfile(userId: string): Promise<ProfileDto> {
    const user = await this.userRepository.getUserById(userId);

    return new ProfileDto({}, user);
  }

  public async activateUserAccount(token: string): Promise<SuccesMessage> {
    await this.userRepository.activateAccount(token);
    return new SuccesMessage({});
  }

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

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (not(isValidPassword)) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }

  // --------------------------- Helpers --------------------------- //

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
