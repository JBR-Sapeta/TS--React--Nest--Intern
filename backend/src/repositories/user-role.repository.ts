import {
  InternalServerErrorException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { isEmpty } from 'ramda';

import { UserRoleEntity } from '../entities';
import { USER_ROLES_ARRAY } from '../common/config/roles';

export class UserRoleRepository
  extends Repository<UserRoleEntity>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly repository: Repository<UserRoleEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async seedRoles(): Promise<void> {
    const roles = await this.find();

    if (isEmpty(roles)) {
      try {
        await this.createQueryBuilder()
          .insert()
          .into(UserRoleEntity)
          .values(USER_ROLES_ARRAY)
          .execute();
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async getRolesByIds(ids: number[]): Promise<UserRoleEntity[]> {
    try {
      const roles = await this.find({ where: { id: In(ids) } });
      return roles;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async onApplicationBootstrap() {
    await this.seedRoles();
  }
}
