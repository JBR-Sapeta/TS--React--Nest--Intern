import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNil } from 'ramda';

import { PL_ERRORS, PL_MESSAGES } from '../locales';
import { CompanyRepository, UserRepository } from '../repositories';

import { CreateCompanyDto, UpdateCompanyDto } from './dto/request';
import { SuccessMessageDto } from '../common/classes';
import { CompanyDto } from './dto/response';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async createCompany(
    userId: string,
    { name, slug, email, description, size }: CreateCompanyDto,
  ): Promise<SuccessMessageDto> {
    const user = await this.userRepository.getUserById(userId);
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

    if (company.user.id !== userId) {
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

    if (company.user.id !== userId) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    await this.companyRepository.deleteCompany(companyId);

    return new SuccessMessageDto({ message: PL_MESSAGES.COMPANY_DELETED });
  }

  // ----------------------------------------------------------------------- \\\
  public async getCompanyBySlug(slug: string): Promise<CompanyDto> {
    const company = await this.companyRepository.getCompanyBySlug(slug);

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    return new CompanyDto({}, company);
  }
}
