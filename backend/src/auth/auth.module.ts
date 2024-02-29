import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, UserRoleEntity } from '../entities';
import { UserRepository, UserRoleRepository } from '../repositories';
import { MailService } from '../mail/mail.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
    MailService,
    UserRepository,
    UserRoleRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
