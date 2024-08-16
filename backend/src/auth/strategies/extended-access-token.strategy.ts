import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserEntity } from '../../entity';
import { UserRepository } from '../../repository';

import { ENV_KEYS } from '../../common/constants';
import type { JwtPayload } from '../../common/types';

@Injectable()
export class ExtendedAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'extended-jwt-access-token',
) {
  constructor(
    private readonly userRepository: UserRepository,
    public readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(ENV_KEYS.JWT_ACCESS_TOKEN_SECRET),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { userId } = payload;
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Sign in to access this resource.');
    }

    return user;
  }
}
