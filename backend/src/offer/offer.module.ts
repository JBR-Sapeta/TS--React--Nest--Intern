import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ApplicationEntity,
  BranchEntity,
  CategoryEntity,
  CompanyEntity,
  EmploymentTypeEntity,
  OfferEntity,
  OperatingModeEntity,
} from '../entity';
import {
  ApplicationRepository,
  BranchRepository,
  CategoryRepository,
  CompanyRepository,
  EmploymentTypeRepository,
  OfferRepository,
  OperatingModeRepository,
} from '../repository';

import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../cache/cache.service';
import { S3Service } from '../s3/s3.service';

import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ApplicationEntity,
      BranchEntity,
      CategoryEntity,
      CompanyEntity,
      EmploymentTypeEntity,
      OfferEntity,
      OperatingModeEntity,
    ]),
  ],
  controllers: [OfferController],
  providers: [
    Logger,
    CacheService,
    OfferService,
    S3Service,
    ApplicationRepository,
    BranchRepository,
    CategoryRepository,
    CompanyRepository,
    EmploymentTypeRepository,
    OfferRepository,
    OperatingModeRepository,
  ],
})
export class OfferModule {}
