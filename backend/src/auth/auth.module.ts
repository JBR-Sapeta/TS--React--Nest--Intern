import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, UserRoleEntity } from '../entities';
import { UserRepository, UserRoleRepository } from '../repositories';
import { MailService } from '../mail/mail.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  LocalStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
    MailService,
    UserRepository,
    UserRoleRepository,
  ],
})
export class AuthModule {}
