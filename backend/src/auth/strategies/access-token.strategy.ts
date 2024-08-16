import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ENV_KEYS } from '../../common/constants';
import type { JwtPayload } from '../../common/types';
import { RoleEntity } from '../../entity';

type JsonWebTokenPayload = {
  userId: string;
  roles: RoleEntity[];
  iat: number;
  exp: number;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(ENV_KEYS.JWT_ACCESS_TOKEN_SECRET),
    });
  }

  validate(payload: JsonWebTokenPayload): JwtPayload {
    const { userId, roles } = payload;
    return { userId, roles };
  }
}
