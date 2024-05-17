import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { CompanyEntity, UserEntity } from '../entities';
import { PL_ERRORS } from '../locales';
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
  public async getCompanyBySlug(
    slug: string,
  ): Promise<Nullable<CompanyEntity>> {
    try {
      const company = await this.findOne({ where: { slug } });
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
  public async getCompanies(
    pageNumber: number,
    limit: number,
  ): Promise<[CompanyEntity[], number]> {
    try {
      const companies = await this.findAndCount({
        order: {
          createdAt: 'DESC',
        },
        skip: pageNumber * limit,
        take: limit,
      });
      return companies;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - getCompanies',
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
