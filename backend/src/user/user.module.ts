import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, UserRoleEntity } from '../entities';
import { UserRepository, UserRoleRepository } from '../repositories';
import { AuthModule } from '../auth/auth.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController],
  providers: [Logger, UserService, UserRepository, UserRoleRepository],
  exports: [UserService],
})
export class UserModule {}
