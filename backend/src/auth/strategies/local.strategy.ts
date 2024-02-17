import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { isEmail, isEmpty } from 'class-validator';

import type { UserEntity } from '../../entities';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    if (isEmpty(email) || !isEmail(email)) {
      throw new BadRequestException('Please enter a valid email address.');
    }

    if (isEmpty(password)) {
      throw new BadRequestException('Please enter your password.');
    }

    const user = await this.authService.validateUserCredentials(
      email,
      password,
    );

    return user;
  }
}
