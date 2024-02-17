import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {
  LocalStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
    UserRepository,
  ],
})
export class AuthModule {}
