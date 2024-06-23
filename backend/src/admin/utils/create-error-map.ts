import * as path from 'path';

import { ErrorBucketDto } from '../dto/response';

let errorFilename: string;

if (process.env.NODE_ENV === 'prod') {
  errorFilename = 'error.prod.log';
} else if (process.env.NODE_ENV === 'dev') {
  errorFilename = 'error.dev.log';
} else if (process.env.NODE_ENV === 'test') {
  errorFilename = 'error.test.log';
} else {
  errorFilename = 'error.log';
}

export const LOGGER_FILE_PATH = path.join('.', errorFilename);

export function createErrorMap() {
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
