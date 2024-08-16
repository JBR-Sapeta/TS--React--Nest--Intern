import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import {
  ApplicationEntity,
  CompanyEntity,
  OfferEntity,
  RoleEntity,
  UserEntity,
} from '../entity';
import {
  CompanyRepository,
  OfferRepository,
  UserRepository,
} from '../repository';

import { S3Service } from '../s3/s3.service';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

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
  controllers: [AdminController],
  providers: [
    Logger,
    AdminService,
    CompanyRepository,
    OfferRepository,
    UserRepository,
    S3Service,
  ],
})
export class AdminModule {}
