import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { CategoryEntity, CompanyEntity, UserEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import {
  AddressParams,
  CategoriesParams,
  CompanyAdminParams,
  CompanyParams,
  PaginationParams,
  addAddressParamsToQueryBuilder,
  addCategoriesParamsToCompanyQueryBuilder,
  addCompanyAdminParamsToQueryBuilder,
  addCompanyParamsToQueryBuilder,
  addPaginationParamsToQueryBuilder,
  joinUserBaseOnCompanyAdminParams,
} from '../common/classes/params';
import { PostgresqlErrorCode } from '../common/enums';
import { Nullable } from '../common/types';

export class CompanyRepository extends Repository<CompanyEntity> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repository: Repository<CompanyEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
  public async createCompanyTransaction(
    user: UserEntity,
    companyData: {
      name: string;
      slug: string;
      email: string;
      description: string;
      size: number;
      categories: CategoryEntity[];
    },
    queryRunner: QueryRunner,
  ): Promise<CompanyEntity> {
    const company = this.create({ user, ...companyData });

    try {
      const createdCompany = await queryRunner.manager.save(
        CompanyEntity,
        company,
      );
      return createdCompany;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - createCompanyTransaction',
        error.stack,
      );

      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(PL_ERRORS.CONFLICT_SLUG_OR_NAME_TAKEN);
      }

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateCompany(
    company: CompanyEntity,
    fieldsToUpdate: Partial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    try {
      Object.assign(company, fieldsToUpdate);

      const updatedCompany = await this.save(company);
      return updatedCompany;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - updateCompany',
        error.stack,
      );

      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(PL_ERRORS.CONFLICT_EMAIL_TAKEN);
      }

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanyById({
    companyId,
    user = false,
    branches = false,
  }: {
    companyId: string;
    user?: boolean;
    branches?: boolean;
  }): Promise<Nullable<CompanyEntity>> {
    try {
      const company = await this.findOne({
        where: { id: companyId },
        relations: { user, branches },
      });
      return company;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - getCompanyById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanyByUserId({
    userId,
    branches = false,
    categories = false,
  }: {
    userId: string;
    branches?: boolean;
    categories?: boolean;
  }): Promise<Nullable<CompanyEntity>> {
    try {
      const company = await this.findOne({
        where: { userId },
        relations: { categories, branches },
      });
      return company;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - getCompanyByUserId',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanyBySlug(
    slug: string,
  ): Promise<Nullable<CompanyEntity>> {
    try {
      const company = await this.findOne({
        where: { slug },
        relations: { categories: true },
      });
      return company;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - getCompanyBySlug',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getVerifiedCompanies(
    categoreisParams: CategoriesParams,
    locationParams: AddressParams,
    paginationParams: PaginationParams,
  ): Promise<[CompanyEntity[], number]> {
    try {
      const query = this.createQueryBuilder('company')
        .leftJoinAndSelect('company.categories', 'category')
        .leftJoinAndSelect('company.branches', 'branch')
        .leftJoinAndSelect('branch.address', 'address')
        .where('company.is_verified = :isVerified', { isVerified: true });

      addCategoriesParamsToCompanyQueryBuilder(query, categoreisParams);
      addAddressParamsToQueryBuilder(query, locationParams);
      addPaginationParamsToQueryBuilder(query, paginationParams);

      const companies = await query
        .orderBy('company.createdAt', 'DESC')
        .getManyAndCount();

      return companies;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - getVerifiedCompanies',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getAllCompanies(
    companyAdminParams: CompanyAdminParams,
    companyParams: CompanyParams,
    paginationParams: PaginationParams,
  ): Promise<[CompanyEntity[], number]> {
    try {
      const query = this.createQueryBuilder('company');

      joinUserBaseOnCompanyAdminParams(query, companyAdminParams);

      addCompanyParamsToQueryBuilder(query, companyParams);
      addCompanyAdminParamsToQueryBuilder(query, companyAdminParams);
      addPaginationParamsToQueryBuilder(query, paginationParams);

      const companies = await query
        .orderBy('company.createdAt', 'DESC')
        .getManyAndCount();

      return companies;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - getAllCompanies',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteCompanyTransaction(
    company: CompanyEntity,
    queryRunner: QueryRunner,
  ): Promise<void> {
    try {
      await queryRunner.manager.delete(CompanyEntity, [company]);
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - deleteCompanyTransaction',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
