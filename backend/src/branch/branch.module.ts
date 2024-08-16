import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AddressEntity,
  BranchEntity,
  CompanyEntity,
  OfferEntity,
  UserEntity,
} from '../entity';
import {
  AddressRepository,
  BranchRepository,
  CompanyRepository,
} from '../repository';
import { AuthModule } from '../auth/auth.module';
import { GeocoderService } from '../geocoder/geocoder.service';

import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      AddressEntity,
      BranchEntity,
      CompanyEntity,
      OfferEntity,
      UserEntity,
    ]),
  ],
  controllers: [BranchController],
  providers: [
    Logger,
    BranchService,
    GeocoderService,
    AddressRepository,
    BranchRepository,
    CompanyRepository,
  ],
})
export class BranchModule {}
