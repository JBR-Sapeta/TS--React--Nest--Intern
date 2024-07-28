import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { isNil, isEmpty, isNotNil, not } from 'ramda';

import { OfferEntity } from '../entities';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import {
  ApplicationRepository,
  CategoryRepository,
  CompanyRepository,
  EmploymentTypeRepository,
  OfferRepository,
  OperatingModeRepository,
} from '../repositories';
import { DAY_IN_MS, TIME_OF_REMOVAL } from '../common/constants';
import { SuccessMessageDto } from '../common/classes';
import {
  AddressParams,
  CategoriesParams,
  OfferParams,
  PaginationParams,
} from '../common/classes/params';
import { calculateDate } from '../common/functions';
import { Nullish } from '../common/types';

import { CacheService } from '../cache/cache.service';
import { S3Service } from '../s3/s3.service';

import {
  CompanyOffersResponseDto,
  FullOfferResponseDto,
  OfferPreviewsResponseDto,
  PartialOfferResponseDto,
} from './dto/response';
import { CreateOfferDto, UpdateOfferDto } from './dto/request';

@Injectable()
export class OfferService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly s3Service: S3Service,
    private readonly categoriesRepository: CategoryRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    private readonly offerRepository: OfferRepository,
    private readonly operatingModeRepository: OperatingModeRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async createOffer(
    companyId: string,
    userId: string,
    createOffetDto: CreateOfferDto,
  ): Promise<SuccessMessageDto> {
    const {
      branches: branchesDto,
      categories: categoriesDto,
      employmentType: employmentTypeDto,
      operatingMode: operatingModeDto,
      expirationTime: expirationTimeDto,
      ...offerData
    } = createOffetDto;

    const company = await this.companyRepository.getCompanyById({
      companyId,
      user: true,
      branches: true,
    });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (not(company.isVerified)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    if (userId !== company.userId) {
      this.logger.error(
        OfferService.name + ' - createOffer',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const branches = company.branches.filter((branch) =>
      branchesDto.includes(branch.id),
    );

    if (isEmpty(branches)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_BRANCHES);
    }

    const categories =
      await this.categoriesRepository.getCategoriesByIds(categoriesDto);

    if (isEmpty(categories)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_CATEGORIES);
    }

    const employmentType =
      await this.employmentTypeRepository.getEmploymentTypeById(
        employmentTypeDto,
      );

    if (isNil(employmentType)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_EMPLOYMENT_TYPE);
    }

    const operatingMode =
      await this.operatingModeRepository.getOperatingModeById(operatingModeDto);

    if (isNil(operatingMode)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OPERATING_MODE);
    }

    const expirationDate = calculateDate(expirationTimeDto * DAY_IN_MS);
    const removalDate = calculateDate(
      (expirationTimeDto + TIME_OF_REMOVAL) * DAY_IN_MS,
    );

    await this.offerRepository.createOffer({
      ...offerData,
      expirationDate,
      removalDate,
      employmentType,
      operatingMode,
      branches,
      categories,
      company,
    });

    return new SuccessMessageDto({
      statusCode: 201,
      message: PL_MESSAGES.OFFER_CREATED,
    });
  }

  // ----------------------------------------------------------------------- \\
  public async getOffers(
    paginationParams: PaginationParams,
    offerParams: OfferParams,
    locationParams: AddressParams,
    categoreis: CategoriesParams,
  ): Promise<OfferPreviewsResponseDto> {
    const [offers, count] = await this.offerRepository.getOffers(
      offerParams,
      categoreis,
      locationParams,
      paginationParams,
    );

    return new OfferPreviewsResponseDto({ ...paginationParams, count }, offers);
  }

  public async getCompanyOffers(
    companyId: string,
    userId: string,
  ): Promise<CompanyOffersResponseDto> {
    const company = await this.companyRepository.getCompanyById({
      companyId,
    });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const offers = await this.offerRepository.getCompanyOffers({
      companyId,
      branches: true,
      company: true,
    });

    return new CompanyOffersResponseDto({}, offers);
  }

  // ----------------------------------------------------------------------- \\
  public async getPartialOffer(
    companyId: string,
    offerId: number,
  ): Promise<PartialOfferResponseDto> {
    const key = this.cacheService.composeKey(companyId, offerId);

    const cachedOffer =
      await this.cacheService.getData<Nullish<OfferEntity>>(key);

    if (isNotNil(cachedOffer)) {
      return new PartialOfferResponseDto({}, cachedOffer);
    }

    const offer = await this.offerRepository.getOfferById({
      offerId,
      company: true,
      branches: true,
      categories: true,
    });

    if (isNil(offer) || not(offer.isActive) || offer.companyId !== companyId) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OFFER);
    }

    this.cacheService.setData(key, offer);

    return new PartialOfferResponseDto({}, offer);
  }

  // ----------------------------------------------------------------------- \\
  public async getFullOffer(
    companyId: string,
    offerId: number,
    userId: string,
  ): Promise<FullOfferResponseDto> {
    const company = await this.companyRepository.getCompanyById({
      companyId,
      user: true,
      branches: true,
    });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (userId !== company.userId) {
      this.logger.error(
        OfferService.name + ' - updateOffer',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const offer = await this.offerRepository.getOfferById({
      offerId,
      branches: true,
      categories: true,
    });

    if (isNil(offer)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OFFER);
    }

    if (companyId !== offer.companyId) {
      this.logger.error(
        OfferService.name + ' - updateOffer',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    return new FullOfferResponseDto({}, offer);
  }

  // ----------------------------------------------------------------------- \\
  public async updateOffer(
    companyId: string,
    offerId: number,
    userId: string,
    updateOffetDto: UpdateOfferDto,
  ): Promise<SuccessMessageDto> {
    if (isEmpty(updateOffetDto)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_COMMON_NO_BODY);
    }

    const {
      branches: branchesDto,
      categories: categoriesDto,
      employmentType: employmentTypeDto,
      operatingMode: operatingModeDto,
      ...offerData
    } = updateOffetDto;

    const company = await this.companyRepository.getCompanyById({
      companyId,
      user: true,
      branches: true,
    });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (userId !== company.userId) {
      this.logger.error(
        OfferService.name + ' - updateOffer',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const offer = await this.offerRepository.getOfferById({ offerId });

    if (isNil(offer)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OFFER);
    }

    if (companyId !== offer.companyId) {
      this.logger.error(
        OfferService.name + ' - updateOffer',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    if (isNotNil(branchesDto)) {
      const branches = company.branches.filter((branch) =>
        branchesDto.includes(branch.id),
      );

      if (isEmpty(branches)) {
        throw new NotFoundException(PL_ERRORS.NOT_FUOND_BRANCHES);
      } else {
        offer.branches = branches;
      }
    }

    if (isNotNil(categoriesDto)) {
      const categories =
        await this.categoriesRepository.getCategoriesByIds(categoriesDto);

      if (isEmpty(categories)) {
        throw new NotFoundException(PL_ERRORS.NOT_FUOND_CATEGORIES);
      } else {
        offer.categories = categories;
      }
    }

    if (isNotNil(employmentTypeDto)) {
      const employmentType =
        await this.employmentTypeRepository.getEmploymentTypeById(
          employmentTypeDto,
        );

      if (isNil(employmentType)) {
        throw new NotFoundException(PL_ERRORS.NOT_FUOND_EMPLOYMENT_TYPE);
      } else {
        offer.employmentType = employmentType;
      }
    }

    if (isNotNil(operatingModeDto)) {
      const operatingMode =
        await this.operatingModeRepository.getOperatingModeById(
          operatingModeDto,
        );

      if (isNil(operatingMode)) {
        throw new NotFoundException(PL_ERRORS.NOT_FUOND_OPERATING_MODE);
      } else {
        offer.operatingMode = operatingMode;
      }
    }

    Object.assign(offer, offerData);

    await this.offerRepository.updateOffer(offer);

    return new SuccessMessageDto({
      message: PL_MESSAGES.OFFER_UPDATED,
    });
  }

  // ----------------------------------------------------------------------- \\
  public async deleteOffer(
    companyId: string,
    offerId: number,
    userId: string,
  ): Promise<SuccessMessageDto> {
    const offer = await this.offerRepository.getOfferById({
      offerId,
      company: true,
    });

    if (isNil(offer)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OFFER);
    }

    if (userId !== offer.company.userId) {
      this.logger.error(
        OfferService.name + ' - deleteOffer',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    if (companyId !== offer.companyId) {
      this.logger.error(
        OfferService.name + ' - deleteOffer',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const [applications] =
      await this.applicationRepository.getOfferApplicationsById(offerId);

    for (const application of applications) {
      await this.s3Service.deleteApplicationFile(application.fileKey);
    }

    await this.offerRepository.deleteOffer(offerId);

    return new SuccessMessageDto({
      message: PL_MESSAGES.OFFER_DELETED,
    });
  }
}
