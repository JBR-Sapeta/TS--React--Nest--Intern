import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import {
  ApplicationEntity,
  CompanyEntity,
  OfferEntity,
  RoleEntity,
  UserEntity,
} from '../entities';
import { CompanyRepository, UserRepository } from '../repositories';

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
  providers: [Logger, AdminService, CompanyRepository, UserRepository],
})
export class AdminModule {}
