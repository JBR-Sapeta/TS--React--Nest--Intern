import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AddressEntity,
  BranchEntity,
  CompanyEntity,
  UserEntity,
} from '../entities';
import {
  AddressRepository,
  BranchRepository,
  CompanyRepository,
} from '../repositories';
import { AuthModule } from '../auth/auth.module';
import { GeocoderService } from '../geocoder/geocoder.service';

import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserEntity,
      CompanyEntity,
      BranchEntity,
      AddressEntity,
    ]),
  ],
  controllers: [BranchController],
  providers: [
    Logger,
    GeocoderService,
    BranchService,
    CompanyRepository,
    BranchRepository,
    AddressRepository,
  ],
})
export class BranchModule {}
