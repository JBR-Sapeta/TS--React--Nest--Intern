import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { ENV_KEYS } from '../../common/constants';
import type { RTPayload } from '../../common/types';

type RefreshTokenPayload = {
  userId: string;
  iat: number;
  exp: number;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(ENV_KEYS.JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload): RTPayload {
    const refreshToken = req.get('authorization').split(' ')[1];
    const { userId } = payload;

    return {
      userId,
      refreshToken,
    };
  }
}
