import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, RoleEntity, CompanyEntity } from '../entities';
import { UserRepository, RoleRepository } from '../repositories';
import { AuthModule } from '../auth/auth.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity, CompanyEntity]),
  ],
  controllers: [UserController],
  providers: [Logger, UserService, UserRepository, RoleRepository],
  exports: [UserService],
})
export class UserModule {}
