import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { isNil, isEmpty } from 'ramda';

import { PL_ERRORS, PL_MESSAGES } from '../locales';
import {
  CategoryRepository,
  CompanyRepository,
  EmploymentTypeRepository,
  OfferRepository,
  OperatingModeRepository,
} from '../repositories';
import { DAY_IN_MS } from '../common/constants';
import { SuccessMessageDto } from '../common/classes';

import { CreateOfferDto } from './dto/request';

@Injectable()
export class OfferService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly categoriesRepository: CategoryRepository,
    private readonly companyRepository: CompanyRepository,
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

    const company = await this.companyRepository.getCompanyDataById(companyId);

    if (isNil(company)) {
      throw new BadRequestException(PL_ERRORS.NOT_FUOND_COMPANY);
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
      throw new BadRequestException(PL_ERRORS.NOT_FUOND_BRANCHES);
    }

    const categories =
      await this.categoriesRepository.getCategoriesByIds(categoriesDto);

    if (isEmpty(categories)) {
      throw new BadRequestException(PL_ERRORS.NOT_FUOND_CATEGORIES);
    }

    const employmentType =
      await this.employmentTypeRepository.getEmploymentTypeById(
        employmentTypeDto,
      );

    if (isNil(employmentType)) {
      throw new BadRequestException(PL_ERRORS.NOT_FUOND_EMPLOYMENT_TYPE);
    }

    const operatingMode =
      await this.operatingModeRepository.getOperatingModeById(operatingModeDto);

    if (isNil(operatingMode)) {
      throw new BadRequestException(PL_ERRORS.NOT_FUOND_OPERATING_MODE);
    }

    const expirationDate = new Date(
      new Date().getTime() + expirationTimeDto * DAY_IN_MS,
    );

    await this.offerRepository.createOffer({
      ...offerData,
      expirationDate,
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
}
