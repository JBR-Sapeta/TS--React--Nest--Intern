import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty, isNil, isNotNil, not } from 'ramda';

import { UserEntity } from '../entities';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import { ApplicationRepository, OfferRepository } from '../repositories';
import { SuccessMessageDto } from '../common/classes';
import { PaginationParams } from '../common/classes/params';
import { FILE_SIZE_LIMIT } from '../common/config';
import { applicationFileValidator } from '../common/functions';

import { CacheService } from '../cache/cache.service';
import { S3Service } from '../s3/s3.service';

import {
  OfferApplicationsResponseDto,
  UserApplicationsResponseDto,
} from './dto/response';
import { CreateApplicationDto } from './dto/request';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly s3Service: S3Service,
    private readonly applicationRepository: ApplicationRepository,
    private readonly offerRepository: OfferRepository,
  ) {}

  // ----------------------------------------------------------------------- \\
  public async createApplication(
    user: UserEntity,
    offerId: number,
    { message }: CreateApplicationDto,
    file: Express.Multer.File,
  ): Promise<SuccessMessageDto> {
    applicationFileValidator(file, FILE_SIZE_LIMIT.APLLICATION);

    const application =
      await this.applicationRepository.getUserApplicationByIds(
        user.id,
        offerId,
      );

    if (isNotNil(application)) {
      this.logger.error(
        ApplicationService.name + ' - createApplication',
        `ForbiddenException - ${user.id}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_APPLICATION_DUPLICATION);
    }

    const offer = await this.offerRepository.getOfferById({ offerId });

    if (isNil(offer) || not(offer.isActive)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OFFER);
    }

    const now = new Date().getTime();
    const expirationDate = offer.expirationDate.getTime();

    if (now > expirationDate) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OFFER);
    }

    const { firstName, lastName } = user;
    const fileKey = `${firstName}_${lastName}_${uuidv4()}`;
    await this.s3Service.uploadApplicationFile(file, fileKey);

    const messageValue = isEmpty(message) ? null : message;
    await this.applicationRepository.createApplication(
      messageValue,
      fileKey,
      user,
      offer,
    );

    return new SuccessMessageDto({ message: PL_MESSAGES.APPLICATION_CREATED });
  }

  // ----------------------------------------------------------------------- \\
  public async getApplicationFile(
    userId: string,
    applicationId: number,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    const application =
      await this.applicationRepository.getApplicationWithCompanyById(
        applicationId,
      );

    if (isNil(application)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_APPLICATION);
    }

    if (application.offer.company.userId !== userId) {
      this.logger.error(
        ApplicationService.name + ' - getApplicationFile',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    if (not(application.isDownloaded)) {
      await this.applicationRepository.setIsDownloadedFlag(application);
    }

    const { data, contentType } = await this.s3Service.getApplicationFile(
      application.fileKey,
    );
    const buffer = Buffer.from(data);

    return { buffer, contentType };
  }

  // ----------------------------------------------------------------------- \\
  public async getOfferApplications(
    paginationParams: PaginationParams,
    offerId: number,
    userId: string,
  ): Promise<OfferApplicationsResponseDto> {
    const offer = await this.offerRepository.getOfferById({
      offerId,
      company: true,
    });

    if (isNil(offer)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_OFFER);
    }

    if (offer.company.userId !== userId) {
      this.logger.error(
        ApplicationService.name + ' - getOfferApplications',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const [applications, count] =
      await this.applicationRepository.getOfferApplicationsWithUsersById(
        offerId,
        paginationParams,
      );

    return new OfferApplicationsResponseDto(
      { ...paginationParams, count },
      applications,
    );
  }

  // ----------------------------------------------------------------------- \\
  public async getUserApplications(
    paginationParams: PaginationParams,
    userIdParam: string,
    userId: string,
  ): Promise<UserApplicationsResponseDto> {
    if (userIdParam !== userId) {
      this.logger.error(
        ApplicationService.name + ' - getUserApplications',
        `ForbiddenException - ${userIdParam}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const [applications, count] =
      await this.applicationRepository.getUserApplicationsById(
        userIdParam,
        paginationParams,
      );

    return new UserApplicationsResponseDto(
      { ...paginationParams, count },
      applications,
    );
  }

  // ----------------------------------------------------------------------- \\
  public async deleteApplication(
    userId: string,
    applicationId: number,
  ): Promise<SuccessMessageDto> {
    const application =
      await this.applicationRepository.getApplicationById(applicationId);

    if (isNil(application)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_APPLICATION);
    }

    if (application.userId !== userId) {
      this.logger.error(
        ApplicationService.name + ' - deleteApplication',
        `ForbiddenException - ${userId}`,
      );

      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    await this.s3Service.deleteApplicationFile(application.fileKey);

    await this.applicationRepository.deleteApplication(applicationId);

    return new SuccessMessageDto({ message: PL_MESSAGES.APPLICATION_DELETED });
  }
}
