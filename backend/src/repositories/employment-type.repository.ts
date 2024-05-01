import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty } from 'ramda';

import { EmploymentTypeEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import { EMPLOYMENT_TYPES_ARRAY } from '../common/config';
import { Nullable } from '../common/types';

export class EmploymentTypeRepository
  extends Repository<EmploymentTypeEntity>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(EmploymentTypeEntity)
    private readonly repository: Repository<EmploymentTypeEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
  public async getEmploymentTypeById(
    employmentTypeId: number,
  ): Promise<Nullable<EmploymentTypeEntity>> {
    try {
      const employmentType = await this.findOneBy({ id: employmentTypeId });
      return employmentType;
    } catch (error) {
      this.logger.error(
        EmploymentTypeRepository.name + ' - getEmploymentTypeById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async seedEmploymentTypes(): Promise<void> {
    let employmentTypes: EmploymentTypeEntity[] = [];

    try {
      employmentTypes = await this.find();
    } catch (error) {
      this.logger.error(
        EmploymentTypeRepository.name + ' - seedEmploymentTypes',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    if (isEmpty(employmentTypes)) {
      try {
        await this.createQueryBuilder()
          .insert()
          .into(EmploymentTypeEntity)
          .values(EMPLOYMENT_TYPES_ARRAY)
          .execute();
      } catch (error) {
        this.logger.error(
          EmploymentTypeRepository.name + ' - seedEmploymentTypes',
          error.stack,
        );
      }
    }
  }

  // ----------------------------------------------------------------------- \\
  public async onApplicationBootstrap() {
    await this.seedEmploymentTypes();
  }
}
