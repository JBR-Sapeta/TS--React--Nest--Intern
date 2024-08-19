import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { OfferEntity } from '../entity';
import { PL_ERRORS } from '../locales';
import {
  AddressParams,
  CategoriesParams,
  OfferParams,
  PaginationParams,
  addAddressParamsToQueryBuilder,
  addCategoriesParamsToOfferQueryBuilder,
  addOfferParamsToQueryBuilder,
  addPaginationParamsToQueryBuilder,
} from '../common/classes/params';
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
  public async getOffers(
    offerParams: OfferParams,
    categoreisParams: CategoriesParams,
    locationParams: AddressParams,
    paginationParams: PaginationParams,
  ): Promise<[OfferEntity[], number]> {
    const now = new Date();

    try {
      const query = this.createQueryBuilder('offer')
        .leftJoinAndSelect('offer.categories', 'category')
        .leftJoinAndSelect('offer.company', 'company')
        .leftJoinAndSelect('offer.branches', 'branch')
        .leftJoinAndSelect('branch.address', 'address')
        .where('offer.is_active = :isActive', { isActive: true })
        .andWhere('offer.expirationDate > :now', { now });

      addOfferParamsToQueryBuilder(query, offerParams);
      addCategoriesParamsToOfferQueryBuilder(query, categoreisParams);
      addAddressParamsToQueryBuilder(query, locationParams);
      addPaginationParamsToQueryBuilder(query, paginationParams);

      const offers = await query
        .orderBy('offer.createdAt', 'DESC')
        .getManyAndCount();

      return offers;
    } catch (error) {
      this.logger.error(OfferRepository.name + ' - getOffers', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getOffersToRemove(): Promise<OfferEntity[]> {
    let offers: Nullable<OfferEntity[]> = null;

    const now = new Date();

    try {
      offers = await this.find({
        where: { removalDate: LessThan(now) },
        relations: { applications: true },
        take: 50,
      });
    } catch (error) {
      this.logger.error(
        OfferRepository.name + ' - getOffersToRemove',
        error.stack,
      );
    }

    return offers;
  }

  // ----------------------------------------------------------------------- \\
  public async getOfferById({
    offerId,
    company = false,
    branches = false,
    categories = false,
  }: {
    offerId: number;
    company?: boolean;
    branches?: boolean;
    categories?: boolean;
  }): Promise<Nullable<OfferEntity>> {
    try {
      const offer = await this.findOne({
        where: { id: offerId },
        relations: { company, branches, categories },
      });
      return offer;
    } catch (error) {
      this.logger.error(OfferRepository.name + ' - getOfferById', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanyOffers({
    companyId,
    applications = false,
    branches = false,
    categories = false,
    company = false,
  }: {
    companyId: string;
    applications?: boolean;
    branches?: boolean;
    categories?: boolean;
    company?: boolean;
  }): Promise<Nullable<OfferEntity[]>> {
    try {
      const offer = await this.find({
        where: { companyId },
        relations: { applications, branches, categories, company },
      });
      return offer;
    } catch (error) {
      this.logger.error(
        OfferRepository.name + ' - getOffersWithRelations',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateOffer(offer: OfferEntity): Promise<OfferEntity> {
    try {
      const updatedOffer = await this.save(offer);
      return updatedOffer;
    } catch (error) {
      this.logger.error(OfferRepository.name + ' - updateOffer', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteOffer(offerId: number): Promise<void> {
    try {
      await this.delete({ id: offerId });
    } catch (error) {
      this.logger.error(OfferRepository.name + ' - deleteOffer', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteOldOffers(offers: OfferEntity[]): Promise<void> {
    try {
      await this.remove(offers);
    } catch (error) {
      this.logger.error(
        OfferRepository.name + ' - deleteOldOffers',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
