import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyEntity, UserEntity } from '../entities';
import { CompanyRepository, UserRepository } from '../repositories';

import { AuthModule } from '../auth/auth.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CompanyEntity, UserEntity])],
  controllers: [CompanyController],
  providers: [Logger, CompanyService, CompanyRepository, UserRepository],
})
export class CompanyModule {}
