import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import { isNil, not } from 'ramda';

import {
  CompanyAdminParams,
  CompanyParams,
  DateParams,
  PaginationParams,
  UserParams,
} from '../common/classes/params';
import { SuccessMessageDto } from '../common/classes';
import { Roles } from '../common/enums';
import { hasRole } from '../common/functions';
import { Nullable } from '../common/types';
import { UserEntity } from '../entities';
import { PL_ERRORS, PL_MESSAGES } from '../locales';
import {
  CompanyRepository,
  OfferRepository,
  UserRepository,
} from '../repositories';

import { S3Service } from '../s3/s3.service';

import { ErrorLog, ErrorType, LOGGER_FILE_PATH, createErrorMap } from './utils';
import {
  CompaniesAdminResponseDto,
  ErrorBucketsDto,
  ErrorBucketsResponseDto,
  ErrorDto,
  UsersAdminResponseDto,
} from './dto/response';

@Injectable()
export class AdminService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly s3Service: S3Service,
    private readonly companyRepository: CompanyRepository,
    private readonly offerRepository: OfferRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async getLogs({
    startDate,
    endDate,
    user,
  }: DateParams & { user: UserEntity }): Promise<ErrorBucketsResponseDto> {
    if (!hasRole(user.roles, Roles.ADMIN)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INCORRECT_ROLE);
    }

    const ERROR_MAP = createErrorMap();
    let fileContent = '';
    const unknownExceptions: string[] = [];
    let lastDatetime: Nullable<number> = null;
    let startDatetime: Nullable<number> = null;
    let endDatetime: Nullable<number> = null;

    if (!isNil(startDate)) {
      const time = new Date(startDate).getTime();
      startDatetime = time ? time : null;
    }

    if (!isNil(endDate)) {
      const time = new Date(endDate).getTime();
      endDatetime = time ? time : null;
    }

    try {
      fileContent = await fs.promises.readFile(LOGGER_FILE_PATH, 'utf-8');
    } catch (error) {
      console.error(error);
    }

    const lines = fileContent.split('\n');

    for (const line of lines) {
      try {
        const errorObject = JSON.parse(line) as ErrorLog;
        let objDatetime: Nullable<number> = null;

        if ('timestamp' in errorObject) {
          objDatetime = new Date(errorObject.timestamp).getTime();
          lastDatetime = objDatetime;
        }

        if (objDatetime) {
          if (startDatetime && endDatetime) {
            if (not(objDatetime > startDatetime && objDatetime < endDatetime)) {
              continue;
            }
          }

          if (startDatetime) {
            if (not(objDatetime > startDatetime)) {
              continue;
            }
          }

          if (endDatetime) {
            if (not(objDatetime < endDatetime)) {
              continue;
            }
          }
        }

        if (isNil(objDatetime) && lastDatetime) {
          if (startDatetime && endDatetime) {
            if (
              not(lastDatetime > startDatetime && lastDatetime < endDatetime)
            ) {
              continue;
            }
          }

          if (startDatetime) {
            if (not(lastDatetime > startDatetime)) {
              continue;
            }
          }

          if (endDatetime) {
            if (not(lastDatetime < endDatetime)) {
              continue;
            }
          }
        }

        if ('context' in errorObject) {
          let data = null;

          if (Array.isArray(errorObject)) {
            const element = errorObject.stack.at(0);
            if (typeof element === 'string') {
              const stack = element.split('\n');
              data = '';
              for (let i = 0; i > stack.length || i < 2; i++) {
                data = stack + ' ';
              }
            } else if (typeof element === 'object') {
              data = element.httpStatusCode
                ? 'HTTP - ' + element.httpStatusCode
                : null;
            } else {
              unknownExceptions.push(line);
              continue;
            }
          }

          const error = new ErrorDto({ message: errorObject.message, data });

          const buccket =
            ERROR_MAP.get(errorObject.context) ||
            ERROR_MAP.get('UnknownException');

          buccket.pushError(error);

          continue;
        }

        const errorMessage = errorObject.message.split(' - ');

        if (errorMessage.length === 2) {
          const [bucket, context] = errorMessage;

          const element = errorObject.stack.at(0);
          if (typeof element === 'string') {
            if (element.startsWith('ForbiddenException')) {
              const [, data] = element.split(' - ');

              const error = new ErrorDto({
                type: ErrorType.FORBIDDEN,
                context,
                message: 'Unauthorized access request.',
                data,
              });

              const buccket =
                ERROR_MAP.get(bucket) || ERROR_MAP.get('UnknownException');

              buccket.pushError(error);
              continue;
            } else {
              const errorMessage = element.split('\n');

              const message = errorMessage.at(0) + errorMessage.at(1);

              const error = new ErrorDto({
                type: ErrorType.STANDARD,
                context,
                message,
              });

              const buccket =
                ERROR_MAP.get(bucket) || ERROR_MAP.get('UnknownException');

              buccket.pushError(error);
              continue;
            }
          } else if (typeof element === 'object' && element !== null) {
            const data = element?.httpStatusCode
              ? 'HTTP - ' + element?.httpStatusCode
              : null;
            const message = JSON.stringify(element);

            const error = new ErrorDto({
              type: ErrorType.STANDARD,
              context,
              message,
              data,
            });

            const buccket =
              ERROR_MAP.get(bucket) || ERROR_MAP.get('UnknownException');

            buccket.pushError(error);
            continue;
          } else {
            unknownExceptions.push(line);
            continue;
          }
        }

        if (errorMessage.length === 3) {
          const [bucket, context, fileKey] = errorMessage;

          if (fileKey.startsWith('fileKey')) {
            const data = fileKey.split(':$').at(1);

            const error = new ErrorDto({
              type: ErrorType.FILE_OPERATION,
              context,
              data,
            });

            const buccket =
              ERROR_MAP.get(bucket) || ERROR_MAP.get('UnknownException');

            buccket.pushError(error);
            continue;
          } else {
            unknownExceptions.push(line);
            continue;
          }
        }

        unknownExceptions.push(line);
      } catch {
        console.error('Parsing error failed.');
        unknownExceptions.push(line);
      }
    }

    const buckets = [...ERROR_MAP.values()];

    return new ErrorBucketsResponseDto(
      { message: 'Success' },
      new ErrorBucketsDto({ buckets, unknownExceptions }),
    );
  }

  // ----------------------------------------------------------------------- \\
  public async toggleIsVerified(
    companyId: string,
    user: UserEntity,
  ): Promise<SuccessMessageDto> {
    if (!hasRole(user.roles, Roles.ADMIN)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INCORRECT_ROLE);
    }

    const company = await this.companyRepository.getCompanyById({
      companyId,
      user: true,
    });

    if (isNil(company)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    const newValue = !company.isVerified;

    if (newValue && company.user.hasBan) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_COMPANY_OWNER_HAS_BAN);
    }

    await this.companyRepository.updateCompany(company, {
      isVerified: newValue,
    });

    const message = newValue
      ? PL_MESSAGES.ADMIN_VERIFY_COMPANY
      : PL_MESSAGES.ADMIN_UNVERIFY_COMPANY;

    return new SuccessMessageDto({ message });
  }

  // ----------------------------------------------------------------------- \\
  public async toggleHasBan(
    userIdParam: string,
    user: UserEntity,
  ): Promise<SuccessMessageDto> {
    if (!hasRole(user.roles, Roles.ADMIN)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INCORRECT_ROLE);
    }

    const userToUpdate = await this.userRepository.getUserById(userIdParam);

    if (isNil(userToUpdate)) {
      throw new NotFoundException(PL_ERRORS.NOT_FUOND_COMPANY);
    }

    if (userToUpdate.id === user.id) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    if (hasRole(userToUpdate.roles, Roles.ADMIN)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN);
    }

    const newValue = !userToUpdate.hasBan;

    await this.userRepository.updateUser(userToUpdate, {
      hasBan: newValue,
      refreshToken: null,
    });

    const message = newValue
      ? PL_MESSAGES.ADMIN_BAN_USER
      : PL_MESSAGES.ADMIN_UNBAN_USER;

    return new SuccessMessageDto({ message });
  }

  // ----------------------------------------------------------------------- \\
  public async getCompanies(
    companyAdminParams: CompanyAdminParams,
    companyParams: CompanyParams,
    paginationParams: PaginationParams,
    user: UserEntity,
  ): Promise<CompaniesAdminResponseDto> {
    if (!hasRole(user.roles, Roles.ADMIN)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INCORRECT_ROLE);
    }

    const [data, count] = await this.companyRepository.getAllCompanies(
      companyAdminParams,
      companyParams,
      paginationParams,
    );

    return new CompaniesAdminResponseDto({ ...paginationParams, count }, data);
  }

  // ----------------------------------------------------------------------- \\
  public async getUsers(
    userParams: UserParams,
    paginationParams: PaginationParams,
    user: UserEntity,
  ): Promise<UsersAdminResponseDto> {
    if (!hasRole(user.roles, Roles.ADMIN)) {
      throw new ForbiddenException(PL_ERRORS.FORBIDDEN_INCORRECT_ROLE);
    }

    const [data, count] = await this.userRepository.getUsers(
      userParams,
      paginationParams,
    );

    return new UsersAdminResponseDto({ ...paginationParams, count }, data);
  }

  // ----------------------------------------------------------------------- \\
  @Cron('0 */12 15-20 * * *')
  public async removeInactiveAccounts() {
    const users = await this.userRepository.getInactiveUsers();

    if (users.length > 0) {
      await this.userRepository.deleteUsers(users);

      this.logger.log(
        UserRepository.name + ' - removeInactiveAccounts',
        `remove inactive accounts - ${users.length}`,
      );
    }
  }

  // ----------------------------------------------------------------------- \\
  @Cron('0 */5 15-20 * * *')
  public async removeOldOffers() {
    const offers = await this.offerRepository.getOffersToRemove();

    if (offers.length > 0) {
      const applications = offers.flatMap((offer) => offer.applications);

      for (const { fileKey } of applications) {
        try {
          await this.s3Service.deleteApplicationFile(fileKey);
        } catch {
          this.logger.error(
            `S3Service - removeOldOffers - fileKey:$${fileKey}`,
          );
        }
      }

      await this.offerRepository.deleteOldOffers(offers);

      this.logger.log(
        UserRepository.name + ' - removeOldOffers',
        `remove old offers - ${offers.length}`,
      );
    }
  }
}
