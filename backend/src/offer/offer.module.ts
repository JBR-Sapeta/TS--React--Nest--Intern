import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  BranchEntity,
  CategoryEntity,
  CompanyEntity,
  EmploymentTypeEntity,
  OfferEntity,
  OperatingModeEntity,
} from '../entities';
import {
  BranchRepository,
  CategoryRepository,
  CompanyRepository,
  EmploymentTypeRepository,
  OfferRepository,
  OperatingModeRepository,
} from '../repositories';

import { AuthModule } from '../auth/auth.module';

import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
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
    OfferService,
    CategoryRepository,
    CompanyRepository,
    BranchRepository,
    EmploymentTypeRepository,
    OfferRepository,
    OperatingModeRepository,
  ],
})
export class OfferModule {}
