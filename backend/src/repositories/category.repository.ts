import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { isEmpty } from 'ramda';

import { CategoryEntity } from '../entities';
import { PL_ERRORS } from '../locales';

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

  // ----------------------------------------------------------------------- \\
  public async seedRoles(): Promise<void> {
    let categories: CategoryEntity[] = [];

    try {
      categories = await this.find();
    } catch (error) {
      this.logger.error(CategoryRepository.name + ' - seedRoles', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

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

  // ----------------------------------------------------------------------- \\
  public async getCategoriesTree(): Promise<CategoryEntity[]> {
    try {
      const categories = await this.find({
        where: { parentId: IsNull() },
        relations: { children: true },
      });
      return categories;
    } catch (error) {
      this.logger.error(
        CategoryRepository.name + ' - getCategoriesTree',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getCategories(): Promise<CategoryEntity[]> {
    try {
      const categories = await this.find();
      return categories;
    } catch (error) {
      this.logger.error(
        CategoryRepository.name + ' - getCategories',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async onApplicationBootstrap() {
    await this.seedRoles();
  }
}
