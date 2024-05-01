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

import { OperatingModeEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import { OPERATING_MODES_ARRAY } from '../common/config';
import { Nullable } from '../common/types';

export class OperatingModeRepository
  extends Repository<OperatingModeEntity>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(OperatingModeEntity)
    private readonly repository: Repository<OperatingModeEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
  public async getOperatingModeById(
    operatingModeId: number,
  ): Promise<Nullable<OperatingModeEntity>> {
    try {
      const operatingMode = await this.findOneBy({ id: operatingModeId });
      return operatingMode;
    } catch (error) {
      this.logger.error(
        OperatingModeRepository.name + ' - getOperatingModeById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async seedOperatingModes(): Promise<void> {
    let operatingModes: OperatingModeEntity[] = [];

    try {
      operatingModes = await this.find();
    } catch (error) {
      this.logger.error(
        OperatingModeRepository.name + ' - seedOperatingModes',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    if (isEmpty(operatingModes)) {
      try {
        await this.createQueryBuilder()
          .insert()
          .into(OperatingModeEntity)
          .values(OPERATING_MODES_ARRAY)
          .execute();
      } catch (error) {
        this.logger.error(
          OperatingModeRepository.name + ' - seedOperatingModes',
          error.stack,
        );
      }
    }
  }

  // ----------------------------------------------------------------------- \\
  public async onApplicationBootstrap() {
    await this.seedOperatingModes();
  }
}
