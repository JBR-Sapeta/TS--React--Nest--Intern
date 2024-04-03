import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { isNil, isNotNil, not } from 'ramda';

import { UserEntity } from '../entities';
import {
  AddressRepository,
  BranchRepository,
  CompanyRepository,
} from '../repositories';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import { SuccessMessageDto } from '../common/classes';
import { GeocoderService } from '../geocoder/geocoder.service';

import { CreateBranchDto, UpdateBranchDto } from './dto/request';
import { BranchesDto } from './dto/response';

@Injectable()
export class BranchService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly geocoderService: GeocoderService,
    private readonly companyRepository: CompanyRepository,
    private readonly branchRepository: BranchRepository,
    private readonly addressRepository: AddressRepository,
    private dataSource: DataSource,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async createBranch(
    companyId: string,
    user: UserEntity,
    createBranchDto: CreateBranchDto,
  ): Promise<SuccessMessageDto> {
    const { name, address } = createBranchDto;
    const company = await this.companyRepository.getCompanyById(companyId);

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== user.id) {
      this.logger.error(
        BranchService.name + ' - createBranch',
        `ForbiddenException - ${user.id}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const isValidAddress = await this.geocoderService.validateAddress(address);

    if (not(isValidAddress)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_ADDRESS_CHECK);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newAddress = await this.addressRepository.createAddressTransaction(
        address,
        queryRunner,
      );

      await this.branchRepository.createBranchTransaction(
        name,
        newAddress,
        company,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return new SuccessMessageDto({
      statusCode: 201,
      message: PL_MESSAGES.BRANCH_CREATED,
    });
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanyBranches(companyId: string): Promise<BranchesDto> {
    const [data, count] =
      await this.branchRepository.getCompanyBranches(companyId);

    return new BranchesDto({}, data, count);
  }

  // ----------------------------------------------------------------------- \\
  public async updateBranch(
    companyId: string,
    branchId: number,
    userId: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<SuccessMessageDto> {
    const { name, address } = updateBranchDto;
    const company = await this.companyRepository.getCompanyById(companyId);
    const branch = await this.branchRepository.getBranchById(branchId);

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (isNil(branch)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_BRANCH);
    }

    if (company.userId !== userId) {
      this.logger.error(
        BranchService.name + ' - updateBranch',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    if (isNil(name) && isNil(address)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_NO_BODY);
    }

    if (isNotNil(address)) {
      const isValidAddress =
        await this.geocoderService.validateAddress(address);

      if (not(isValidAddress)) {
        throw new BadRequestException(PL_ERRORS.VALIDATION_ADDRESS_CHECK);
      }

      branch.address = { ...branch.address, ...address };
    }

    if (name) {
      branch.name = name;
    }

    await this.branchRepository.updateBranch(branch);

    return new SuccessMessageDto({ message: PL_MESSAGES.BRANCH_UPDATED });
  }

  // ----------------------------------------------------------------------- \\
  public async deleteBranch(
    companyId: string,
    branchId: number,
    userId: string,
  ): Promise<SuccessMessageDto> {
    const company = await this.companyRepository.getCompanyById(companyId);
    const branch = await this.branchRepository.getBranchById(branchId);

    if (isNil(company) || isNil(branch)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND);
    }

    if (company.userId !== userId || branch.companyId !== companyId) {
      this.logger.error(
        BranchService.name + ' - deleteBranch',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    await this.branchRepository.deleteBranch(branchId);

    return new SuccessMessageDto({ message: PL_MESSAGES.BRANCH_DELETED });
  }
}
