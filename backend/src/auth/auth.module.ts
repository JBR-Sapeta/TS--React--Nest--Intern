import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, RoleEntity } from '../entities';
import { UserRepository, RoleRepository } from '../repositories';
import { MailService } from '../mail/mail.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

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
    RefreshTokenStrategy,
    AuthService,
    MailService,
    UserRepository,
    RoleRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
