import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OfferEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import { Nullable } from '../common/types';
import { CreateOfferData } from './types';

export class OfferRepository extends Repository<OfferEntity> {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly repository: Repository<OfferEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
  public async createOffer(
    offerData: CreateOfferData,
  ): Promise<Nullable<OfferEntity>> {
    try {
      const createdOffer = await this.save(offerData);
      return createdOffer;
    } catch (error) {
      this.logger.error(OfferRepository.name + ' - createOffer', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getOfferById(offerId: number): Promise<Nullable<OfferEntity>> {
    try {
      const offer = await this.findOne({
        where: { id: offerId },
      });
      return offer;
    } catch (error) {
      this.logger.error(OfferRepository.name + ' - getOfferById', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
