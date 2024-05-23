import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { isNil, not } from 'ramda';

import { SuccessMessageDto } from '../common/classes';
import { DateParams } from '../common/classes/params';
import { Nullable } from '../common/types';

import { ErrorLog, ErrorType } from './utils/type';
import {
  ErrorBucketDto,
  ErrorBucketsDto,
  ErrorBucketsResponseDto,
  ErrorDto,
} from './dto/response';

const LOGGER_FILE_PATH = path.join('.', 'error.dev.log');

function createErrorMap() {
  return new Map([
    ['AppService', new ErrorBucketDto('AppService')],
    ['AddressRepository', new ErrorBucketDto('AddressRepository')],
    ['ApplicationService', new ErrorBucketDto('ApplicationService')],
    ['ApplicationRepository', new ErrorBucketDto('ApplicationRepository')],
    ['AuthService', new ErrorBucketDto('AuthService')],
    ['BranchService', new ErrorBucketDto('BranchService')],
    ['BranchRepository', new ErrorBucketDto('BranchRepository')],
    ['CacheService', new ErrorBucketDto('CacheService')],
    ['CategoryService', new ErrorBucketDto('CategoryService')],
    ['CategoryRepository', new ErrorBucketDto('CategoryRepository')],
    ['CompanyService', new ErrorBucketDto('CompanyService')],
    ['CompanyRepository', new ErrorBucketDto('CompanyRepository')],
    ['GeocoderService', new ErrorBucketDto('GeocoderService')],
    ['MailService', new ErrorBucketDto('MailService')],
    ['OfferService', new ErrorBucketDto('OfferService')],
    ['OfferRepository', new ErrorBucketDto('OfferRepository')],
    ['OperatingModeRepository', new ErrorBucketDto('OperatingModeRepository')],
    ['S3Service', new ErrorBucketDto('S3Service')],
    ['UserService', new ErrorBucketDto('UserService')],
    ['UserRepository', new ErrorBucketDto('UserRepository')],
    ['RoleRepository', new ErrorBucketDto('RoleRepository')],
    ['TypeOrmModule', new ErrorBucketDto('TypeOrmModule')],
    ['ExceptionsHandler', new ErrorBucketDto('ExceptionsHandler')],
    ['UnknownException', new ErrorBucketDto('UnknownException')],
    [
      'EmploymentTypeRepository',
      new ErrorBucketDto('EmploymentTypeRepository'),
    ],
  ]);
}

@Injectable()
export class AdminService {
  public async getLogs({
    startDate,
    endDate,
  }: DateParams): Promise<SuccessMessageDto> {
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

    console.log(ERROR_MAP);

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
}
