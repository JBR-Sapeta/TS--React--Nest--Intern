import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { isEmpty } from 'ramda';

import { RoleEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import { USER_ROLES_ARRAY } from '../common/config/roles';

export class RoleRepository
  extends Repository<RoleEntity>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async seedRoles(): Promise<void> {
    const roles = await this.find();

    if (isEmpty(roles)) {
      try {
        await this.createQueryBuilder()
          .insert()
          .into(RoleEntity)
          .values(USER_ROLES_ARRAY)
          .execute();
      } catch (error) {
        this.logger.error(RoleRepository.name + ' - seedRoles', error.stack);
      }
    }
  }

  public async getRolesByIds(ids: number[]): Promise<RoleEntity[]> {
    try {
      const roles = await this.find({ where: { id: In(ids) } });
      return roles;
    } catch (error) {
      this.logger.error(RoleRepository.name + ' - getRolesByIds', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async onApplicationBootstrap() {
    await this.seedRoles();
  }
}
