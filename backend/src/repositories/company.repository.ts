import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  public async createCompany(
    name: string,
    slug: string,
    email: string,
    description: string,
    size: number,
    user: UserEntity,
  ): Promise<CompanyEntity> {
    const company = this.create({ name, slug, email, description, size, user });

    try {
      const createdUser = await this.save(company);
      return createdUser;
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - createCompany',
        error.stack,
      );

      if (error?.code === PostgresqlErrorCode.UNIQUE_VIOLATION) {
        throw new ConflictException(PL_ERRORS.CONFLICT_EMAIL_TAKEN);
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
  public async deleteCompany(companyId: string): Promise<void> {
    try {
      await this.delete({ id: companyId });
    } catch (error) {
      this.logger.error(
        CompanyRepository.name + ' - updateCompany',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanyById(
    companyId: string,
  ): Promise<Nullable<CompanyEntity>> {
    try {
      const company = await this.findOne({
        where: { id: companyId },
        relations: { user: true },
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
}
