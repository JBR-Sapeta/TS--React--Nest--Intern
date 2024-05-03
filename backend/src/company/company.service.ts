import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNil, isNotNil } from 'ramda';

import { UserEntity } from '../entities';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import { CompanyRepository } from '../repositories';

import { CreateCompanyDto, UpdateCompanyDto } from './dto/request';
import { SuccessMessageDto } from '../common/classes';
import { CompaniesDto, PartialCompanyResponseDto } from './dto/response';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  // ----------------------------------------------------------------------- \\
  public async createCompany(
    user: UserEntity,
    { name, slug, email, description, size }: CreateCompanyDto,
  ): Promise<SuccessMessageDto> {
    const userCompany = await this.companyRepository.findOneBy({
      userId: user.id,
    });

    if (isNotNil(userCompany)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_ONE_COMPANY_PER_USER);
    }

    await this.companyRepository.createCompany(
      name,
      slug,
      email,
      description,
      size,
      user,
    );

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
    const company = await this.companyRepository.getCompanyById(companyId);

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    await this.companyRepository.updateCompany(company, updateCompanyDto);

    return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_UPDATED });
  }

  // ----------------------------------------------------------------------- \\\
  public async deleteCompany(
    userId: string,
    companyId: string,
  ): Promise<SuccessMessageDto> {
    const company = await this.companyRepository.getCompanyById(companyId);

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    await this.companyRepository.deleteCompany(companyId);

    return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_DELETED });
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
    pageNumber: number,
    limit: number,
  ): Promise<CompaniesDto> {
    const [data, count] = await this.companyRepository.getCompanies(
      pageNumber,
      limit,
    );

    return new CompaniesDto({ limit, pageNumber, count }, data);
  }
}
