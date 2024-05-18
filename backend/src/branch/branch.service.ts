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
import { isEmpty, isNil, isNotNil, not } from 'ramda';

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
    const company = await this.companyRepository.getCompanyById({ companyId });

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
    if (isEmpty(updateBranchDto)) {
      throw new BadRequestException(PL_ERRORS.VALIDATION_COMMON_NO_BODY);
    }

    const company = await this.companyRepository.getCompanyById({ companyId });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (company.userId !== userId) {
      this.logger.error(
        BranchService.name + ' - updateBranch',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const branch = await this.branchRepository.getBranchById({ branchId });

    if (isNil(branch)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_BRANCH);
    }

    const { address, name } = updateBranchDto;

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
    const branch = await this.branchRepository.getBranchById({
      branchId,
      company: true,
      offers: true,
    });

    if (isNil(branch) || branch.companyId !== companyId) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND);
    }

    if (!isEmpty(branch.offers)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_BRANCH_IN_USE);
    }

    if (branch.company.userId !== userId) {
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
