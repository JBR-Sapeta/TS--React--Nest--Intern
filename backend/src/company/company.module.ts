import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AddressEntity,
  ApplicationEntity,
  BranchEntity,
  CompanyEntity,
  OfferEntity,
  RoleEntity,
  UserEntity,
} from '../entities';
import {
  ApplicationRepository,
  CompanyRepository,
  OfferRepository,
  RoleRepository,
  UserRepository,
} from '../repositories';

import { AuthModule } from '../auth/auth.module';
import { S3Service } from '../s3/s3.service';

import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      AddressEntity,
      ApplicationEntity,
      BranchEntity,
      CompanyEntity,
      OfferEntity,
      UserEntity,
      RoleEntity,
    ]),
  ],
  controllers: [CompanyController],
  providers: [
    Logger,
    CompanyService,
    S3Service,
    ApplicationRepository,
    CompanyRepository,
    OfferRepository,
    UserRepository,
    RoleRepository,
  ],
})
export class CompanyModule {}
