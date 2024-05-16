import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AddressEntity,
  BranchEntity,
  CompanyEntity,
  UserEntity,
} from '../entities';
import { CompanyRepository, UserRepository } from '../repositories';

import { AuthModule } from '../auth/auth.module';
import { S3Service } from '../s3/s3.service';

import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

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
  controllers: [CompanyController],
  providers: [
    Logger,
    CompanyService,
    S3Service,
    CompanyRepository,
    UserRepository,
  ],
})
export class CompanyModule {}
