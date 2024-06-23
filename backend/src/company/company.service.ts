import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty, isNil, isNotNil, not } from 'ramda';
import { DataSource } from 'typeorm';

import { UserEntity } from '../entities';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import {
  ApplicationRepository,
  CategoryRepository,
  CompanyRepository,
  OfferRepository,
  RoleRepository,
  UserRepository,
} from '../repositories';
import { SuccessMessageDto } from '../common/classes';
import {
  AddressParams,
  CategoriesParams,
  PaginationParams,
} from '../common/classes/params';
import { FILE_SIZE_LIMIT } from '../common/config';
import { Roles } from '../common/enums';
import { hasRole, imageFileValidator } from '../common/functions';
import { Nullable, Optional } from '../common/types';

import { S3Service } from '../s3/s3.service';

import {
  CompaniesPreviewResponseDto,
  FullCompanyResponseDto,
  PartialCompanyResponseDto,
} from './dto/response';
import {
  CreateCompanyDto,
  ResetCompanyImagesDto,
  UpdateCompanyDto,
} from './dto/request';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly s3Service: S3Service,
    private readonly applicationRepository: ApplicationRepository,
    private readonly categoriesRepository: CategoryRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly offeryRepository: OfferRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private dataSource: DataSource,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async createCompany(
    user: UserEntity,
    createCompanyDto: CreateCompanyDto,
  ): Promise<SuccessMessageDto> {
    if (hasRole(user.roles, [Roles.COMPANY, Roles.ADMIN])) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_ONE_COMPANY_PER_USER);
    }

    const { categories: categoriesDto, ...companyData } = createCompanyDto;

    const categories =
      await this.categoriesRepository.getCategoriesByIds(categoriesDto);

    if (isEmpty(categories)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_CATEGORIES);
    }

    const roles = await this.roleRepository.getRolesByIds([Roles.COMPANY]);
    const [userApplications] =
      await this.applicationRepository.getAllUserApplications(user.id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!isEmpty(userApplications)) {
        await this.applicationRepository.deleteApplicationsTransaction(
          userApplications,
          queryRunner,
        );
      }

      const updatedUser = await this.userRepository.updateUserTransaction(
        user,
        { roles },
        queryRunner,
      );

      await this.companyRepository.createCompanyTransaction(
        updatedUser,
        { ...companyData, categories },
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    for (const { fileKey } of userApplications) {
      try {
        await this.s3Service.deleteApplicationFile(fileKey);
      } catch {
        this.logger.error(
          `S3Service - deleteApplicationFile - fileKey:$${fileKey}`,
        );
      }
    }

    return new SuccessMessageDto({
      statusCode: 201,
      message: PL_MESSAGES.COMPANY_CREATED,
    });
  }

  // ----------------------------------------------------------------------- \\\
  public async updateCompany(
    userId: string,
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<SuccessMessageDto> {
    if (isEmpty(updateCompanyDto)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_COMMON_NO_BODY);
    }

    const company = await this.companyRepository.getCompanyById({ companyId });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const { categories: categoriesDto, ...companyData } = updateCompanyDto;

    if (isNotNil(categoriesDto)) {
      const categories =
        await this.categoriesRepository.getCategoriesByIds(categoriesDto);

      if (isEmpty(categories)) {
        throw new NotFoundException(PL_ERRORS.NOT_FUOND_CATEGORIES);
      } else {
        company.categories = categories;
      }
    }

    await this.companyRepository.updateCompany(company, companyData);

    return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_UPDATED });
  }

  // ----------------------------------------------------------------------- \\\
  public async uploadCompanyImages(
    companyId: string,
    userId: string,
    files: Optional<{
      logoFile?: Express.Multer.File[];
      mainPhotoFile?: Express.Multer.File[];
    }>,
  ): Promise<SuccessMessageDto> {
    if (isNil(files)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_FILE_NOT_PROVIDED);
    }

    const { logoFile, mainPhotoFile } = files;

    if (isNil(logoFile) && isNil(mainPhotoFile)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_FILE_NOT_PROVIDED);
    }

    const logo = logoFile ? logoFile[0] : null;
    const mainPhoto = mainPhotoFile ? mainPhotoFile[0] : null;

    imageFileValidator(logo, FILE_SIZE_LIMIT.COMPANY_LOGO);
    imageFileValidator(mainPhoto, FILE_SIZE_LIMIT.COMPANY_MAIN_PHOT);

    const company = await this.companyRepository.getCompanyById({ companyId });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const oldLogoUrl = company.logoUrl;
    const oldMainPhotoUrl = company.logoUrl;
    const logoKey = `${company.slug}_logo_${uuidv4()}`;
    const mainPhotoKey = `${company.slug}_mainPhoto_${uuidv4()}`;
    let newLogUrl: Nullable<string> = null;
    let newMainPhotoUrl: Nullable<string> = null;

    try {
      if (isNotNil(logo)) {
        newLogUrl = await this.s3Service.uploadImageFile(logo, logoKey);
        company.logoUrl = newLogUrl;
      }
    } catch (error) {
      throw error;
    }

    try {
      if (isNotNil(mainPhoto)) {
        newMainPhotoUrl = await this.s3Service.uploadImageFile(
          mainPhoto,
          mainPhotoKey,
        );
        company.mainPhotoUrl = newMainPhotoUrl;
      }
    } catch (error) {
      if (isNotNil(newLogUrl)) {
        this.logger.error(`S3Service - uploadImageFile - fileKey:$${logoKey}`);
      }

      throw error;
    }

    try {
      await this.companyRepository.save(company);
    } catch (error) {
      if (isNotNil(newLogUrl)) {
        this.logger.error(`S3Service - uploadImageFile - fileKey:$${logoKey}`);
      }
      if (isNotNil(newMainPhotoUrl)) {
        this.logger.error(
          `S3Service - uploadImageFile - fileKey:$${mainPhotoKey}`,
        );
      }
      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    try {
      if (isNotNil(logo) && isNotNil(oldLogoUrl)) {
        await this.s3Service.deleteImageFile(oldLogoUrl);
      }
    } catch {
      const fileKey = this.s3Service.getKeyFromUrl(oldLogoUrl);
      this.logger.error(`S3Service - deleteImageFile - fileKey:$${fileKey}`);
    }

    try {
      if (isNotNil(mainPhoto) && isNotNil(oldMainPhotoUrl)) {
        await this.s3Service.deleteImageFile(oldMainPhotoUrl);
      }
    } catch {
      const fileKey = this.s3Service.getKeyFromUrl(oldMainPhotoUrl);
      this.logger.error(`S3Service - deleteImageFile - fileKey:$${fileKey}`);
    }

    return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_UPDATED });
  }

  // ----------------------------------------------------------------------- \\\
  public async resetCompanyImages(
    companyId: string,
    userId: string,
    resetCompanyImagesDto: ResetCompanyImagesDto,
  ): Promise<SuccessMessageDto> {
    if (isEmpty(resetCompanyImagesDto)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_COMMON_NO_BODY);
    }

    const { logoUrl, mainPhotoUrl } = resetCompanyImagesDto;

    if (not(logoUrl) && not(mainPhotoUrl)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_COMMON_NO_BODY);
    }

    const company = await this.companyRepository.getCompanyById({ companyId });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const oldLogoUrl = company.logoUrl;
    const oldMainPhotoUrl = company.mainPhotoUrl;

    if (
      (not(logoUrl) && not(mainPhotoUrl)) ||
      (logoUrl && isNil(oldLogoUrl) && mainPhotoUrl && isNil(oldMainPhotoUrl))
    ) {
      return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_UPDATED });
    }

    if (logoUrl) {
      company.logoUrl = null;
    }

    if (mainPhotoUrl) {
      company.mainPhotoUrl = null;
    }

    try {
      await this.companyRepository.save(company);
    } catch (error) {
      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }

    const companyImagess = [
      { remove: logoUrl, oldUrl: oldLogoUrl },
      { remove: mainPhotoUrl, oldUrl: oldMainPhotoUrl },
    ];

    for (const { remove, oldUrl } of companyImagess) {
      if (remove && oldUrl) {
        try {
          await this.s3Service.deleteImageFile(oldUrl);
        } catch {
          const fileKey = this.s3Service.getKeyFromUrl(oldUrl);
          this.logger.error(
            `S3Service - deleteImageFile - fileKey:$${fileKey}`,
          );
        }
      }
    }

    return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_UPDATED });
  }

  // ----------------------------------------------------------------------- \\\
  public async getCompanyBySlug(
    slug: string,
  ): Promise<PartialCompanyResponseDto> {
    const company = await this.companyRepository.getCompanyBySlug(slug);

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    return new PartialCompanyResponseDto({}, company);
  }

  // ----------------------------------------------------------------------- \\\
  public async getCompanies(
    categoreisParams: CategoriesParams,
    locationParams: AddressParams,
    paginationParams: PaginationParams,
  ): Promise<CompaniesPreviewResponseDto> {
    const [data, count] = await this.companyRepository.getVerifiedCompanies(
      categoreisParams,
      locationParams,
      paginationParams,
    );

    return new CompaniesPreviewResponseDto(
      { ...paginationParams, count },
      data,
    );
  }

  // ----------------------------------------------------------------------- \\\
  public async getUserCompany(
    userId: string,
    userIdParam: string,
  ): Promise<FullCompanyResponseDto> {
    if (userIdParam !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const company = await this.companyRepository.getCompanyByUserId({
      userId,
      branches: true,
      categories: true,
    });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    return new FullCompanyResponseDto({}, company);
  }

  // ----------------------------------------------------------------------- \\\
  public async deleteCompany(
    user: UserEntity,
    companyId: string,
  ): Promise<SuccessMessageDto> {
    const company = await this.companyRepository.getCompanyById({ companyId });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== user.id) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const roles = await this.roleRepository.getRolesByIds([Roles.USER]);
    const offers = await this.offeryRepository.getCompanyOffers({
      companyId,
      applications: true,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.companyRepository.deleteCompanyTransaction(
        company,
        queryRunner,
      );

      await this.userRepository.updateUserTransaction(
        user,
        { roles },
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    const applications = offers.flatMap((offer) => offer.applications);

    for (const { fileKey } of applications) {
      try {
        await this.s3Service.deleteApplicationFile(fileKey);
      } catch {
        this.logger.error(
          `S3Service - deleteApplicationFile - fileKey:$${fileKey}`,
        );
      }
    }

    const companyImages = [company.logoUrl, company.mainPhotoUrl];

    for (const image of companyImages) {
      try {
        if (image) {
          await this.s3Service.deleteImageFile(image);
        }
      } catch {
        const fileKey = this.s3Service.getKeyFromUrl(image);
        this.logger.error(`S3Service - deleteImageFile - fileKey:$${fileKey}`);
      }
    }

    return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_DELETED });
  }
}
