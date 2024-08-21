import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, RoleEntity } from '../entity';
import { UserRepository, RoleRepository } from '../repository';
import { CacheService } from '../cache/cache.service';
import { MailService } from '../mail/mail.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenStrategy,
  ExtendedAccessTokenStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
  ],
  controllers: [AuthController],
  providers: [
    Logger,
    AccessTokenStrategy,
    ExtendedAccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
    CacheService,
    MailService,
    UserRepository,
    RoleRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
