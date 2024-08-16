import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { AddressEntity, CompanyEntity } from '../entity';
import { PL_ERRORS } from '../locales';
import { Nullable } from '../common/types';
import { BranchEntity } from '../entity/branch.entity';

export class BranchRepository extends Repository<BranchEntity> {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly repository: Repository<BranchEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
  public async createBranchTransaction(
    name: string,
    address: AddressEntity,
    company: CompanyEntity,
    queryRunner: QueryRunner,
  ): Promise<BranchEntity> {
    try {
      const createdBranch = await queryRunner.manager.save(BranchEntity, {
        name,
        address,
        company,
      });
      return createdBranch;
    } catch (error) {
      this.logger.error(
        BranchRepository.name + ' - createBranchTransaction',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getBranchById({
    branchId,
    address = false,
    company = false,
    offers = false,
  }: {
    branchId: number;
    address?: boolean;
    company?: boolean;
    offers?: boolean;
  }): Promise<Nullable<BranchEntity>> {
    try {
      const branch = await this.findOne({
        where: { id: branchId },
        relations: { company, address, offers },
      });
      return branch;
    } catch (error) {
      this.logger.error(
        BranchRepository.name + ' - getBranchById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanyBranches(
    companyId: string,
  ): Promise<[BranchEntity[], number]> {
    try {
      const branches = await this.findAndCount({
        where: { company: { id: companyId } },
        relations: { address: true },
        order: { name: 'ASC' },
      });
      return branches;
    } catch (error) {
      this.logger.error(
        BranchRepository.name + ' - getCompanyBranches',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async updateBranch(branch: BranchEntity): Promise<BranchEntity> {
    try {
      const branches = await this.save(branch);
      return branches;
    } catch (error) {
      this.logger.error(BranchRepository.name + ' - updateBranch', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteBranch(branchId: number): Promise<void> {
    try {
      await this.delete({ id: branchId });
    } catch (error) {
      this.logger.error(BranchRepository.name + ' - deleteBranch', error.stack);

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
