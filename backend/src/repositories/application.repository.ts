import {
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApplicationEntity, OfferEntity, UserEntity } from '../entities';
import { PL_ERRORS } from '../locales';
import { Nullable } from '../common/types';
import { PaginationParams } from '../common/classes/params';

export class ApplicationRepository extends Repository<ApplicationEntity> {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repository: Repository<ApplicationEntity>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // ----------------------------------------------------------------------- \\
  public async createApplication(
    message: string,
    fileKey: string,
    user: UserEntity,
    offer: OfferEntity,
  ): Promise<ApplicationEntity> {
    const application = this.create({ message, fileKey, user, offer });

    try {
      const createdApplication = await this.save(application);
      return createdApplication;
    } catch (error) {
      this.logger.error(`S3 - createApplication - fileKey:$${fileKey}`);
      this.logger.error(
        ApplicationRepository.name + ` - createApplication `,
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getApplicationById(
    applicationId: number,
  ): Promise<Nullable<ApplicationEntity>> {
    try {
      const company = await this.findOne({
        where: { id: applicationId },
      });
      return company;
    } catch (error) {
      this.logger.error(
        ApplicationRepository.name + ' - getApplicationById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getOfferApplicationsById(
    offerId: number,
    { pageNumber, limit }: PaginationParams,
  ): Promise<[ApplicationEntity[], number]> {
    try {
      const applications = await this.findAndCount({
        where: { offerId },
        order: {
          createdAt: 'DESC',
        },
        relations: {
          user: true,
        },
        skip: pageNumber * limit,
        take: limit,
      });
      return applications;
    } catch (error) {
      this.logger.error(
        ApplicationRepository.name + ' - getUserApplicationsById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getApplicationWithRelationsById(
    applicationId: number,
  ): Promise<Nullable<ApplicationEntity>> {
    try {
      const company = await this.findOne({
        where: { id: applicationId },
        relations: { offer: { company: true } },
      });
      return company;
    } catch (error) {
      this.logger.error(
        ApplicationRepository.name + ' - getApplicationById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getUserApplicationByIds(
    userId: string,
    offerId: number,
  ): Promise<Nullable<ApplicationEntity>> {
    try {
      const company = await this.findOne({
        where: { userId, offerId },
      });
      return company;
    } catch (error) {
      this.logger.error(
        ApplicationRepository.name + ' - getApplicationById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getUserApplicationsById(
    userId: string,
    { pageNumber, limit }: PaginationParams,
  ): Promise<[ApplicationEntity[], number]> {
    try {
      const applications = await this.findAndCount({
        where: { userId },
        order: {
          createdAt: 'DESC',
        },
        relations: {
          offer: { company: true, branches: false, categories: false },
        },
        skip: pageNumber * limit,
        take: limit,
      });
      return applications;
    } catch (error) {
      this.logger.error(
        ApplicationRepository.name + ' - getUserApplicationsById',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async setIsDownloadedFlag(
    application: ApplicationEntity,
  ): Promise<Nullable<ApplicationEntity>> {
    try {
      application.isDownloaded = true;
      const updatedApplication = await this.save(application);

      return updatedApplication;
    } catch (error) {
      this.logger.error(
        ApplicationRepository.name + ' - setIsDownloadedFlag',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteApplication(applicationId: number): Promise<void> {
    try {
      await this.delete({ id: applicationId });
    } catch (error) {
      this.logger.error(
        ApplicationRepository.name + ' - deleteApplication',
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
