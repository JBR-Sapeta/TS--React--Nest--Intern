import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AddressEntity,
  ApplicationEntity,
  BranchEntity,
  CategoryEntity,
  CompanyEntity,
  OfferEntity,
  RoleEntity,
  UserEntity,
} from '../entity';
import {
  ApplicationRepository,
  CategoryRepository,
  CompanyRepository,
  OfferRepository,
  RoleRepository,
  UserRepository,
} from '../repository';

import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../cache/cache.service';
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
      CategoryEntity,
      CompanyEntity,
      OfferEntity,
      UserEntity,
      RoleEntity,
    ]),
  ],
  controllers: [CompanyController],
  providers: [
    Logger,
    CacheService,
    CompanyService,
    S3Service,
    ApplicationRepository,
    CategoryRepository,
    CompanyRepository,
    OfferRepository,
    UserRepository,
    RoleRepository,
  ],
})
export class CompanyModule {}
