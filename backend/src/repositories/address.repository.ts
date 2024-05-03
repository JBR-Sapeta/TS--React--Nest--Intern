import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point, QueryRunner, Repository } from 'typeorm';

import { AddressEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import { GeocoderAddress } from '../common/types';

export class AddressRepository extends Repository<AddressEntity> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly repository: Repository<AddressEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
  public async createAddressTransaction(
    address: GeocoderAddress,
    queryRunner: QueryRunner,
  ): Promise<AddressEntity> {
    try {
      const location: Point = {
        type: 'Point',
        coordinates: [address.long, address.lat],
      };

      const createdAddress = await queryRunner.manager.save(AddressEntity, {
        ...address,
        location,
      });
      return createdAddress;
    } catch (error) {
      this.logger.error(
        AddressRepository.name + ' - createAddressTransaction',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
