import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AddressEntity,
  ApplicationEntity,
  BranchEntity,
  CompanyEntity,
  RoleEntity,
  UserEntity,
} from '../entities';
import {
  ApplicationRepository,
  CompanyRepository,
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
    UserRepository,
    RoleRepository,
  ],
})
export class CompanyModule {}
