import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  UserEntity,
  RoleEntity,
  CompanyEntity,
  ApplicationEntity,
  OfferEntity,
} from '../entities';
import {
  UserRepository,
  RoleRepository,
  OfferRepository,
  ApplicationRepository,
  CompanyRepository,
} from '../repositories';
import { AuthModule } from '../auth/auth.module';

import { S3Service } from '../s3/s3.service';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ApplicationEntity,
      CompanyEntity,
      OfferEntity,
      UserEntity,
      RoleEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [
    Logger,
    UserService,
    S3Service,
    ApplicationRepository,
    CompanyRepository,
    OfferRepository,
    UserRepository,
    RoleRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
