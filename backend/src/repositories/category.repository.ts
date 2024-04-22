import {
  Inject,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty } from 'ramda';

import { CategoryEntity } from '../entities/category.entity';
import { MAIN_CATEGORIES_ARRAY, CATEGORIES_ARRAY } from '../common/config';

export class CategoryRepository
  extends Repository<CategoryEntity>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async seedRoles(): Promise<void> {
    const categories = await this.find();

    if (isEmpty(categories)) {
      try {
        await this.createQueryBuilder()
          .insert()
          .into(CategoryEntity)
          .values(MAIN_CATEGORIES_ARRAY)
          .execute();

        await this.createQueryBuilder()
          .insert()
          .into(CategoryEntity)
          .values(CATEGORIES_ARRAY)
          .execute();
      } catch (error) {
        this.logger.error(
          CategoryRepository.name + ' - seedRoles',
          error.stack,
        );
      }
    }
  }

  public async onApplicationBootstrap() {
    await this.seedRoles();
  }
}
