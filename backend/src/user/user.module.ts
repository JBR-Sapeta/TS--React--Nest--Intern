import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity, UserRoleEntity } from '../entities';
import { UserRepository, UserRoleRepository } from '../repositories';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserRoleRepository],
  exports: [UserService],
})
export class UserModule {}
