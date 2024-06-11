export enum ErrorType {
  STANDARD = 'Standard',
  FORBIDDEN = 'ForbiddenException',
  FILE_OPERATION = 'FileOperation',
}

export type ErrorLog = {
  type: ErrorType;
  context: string;
  message: string;
  data: string | null;
  count: number;
};

export type ErrorLogsBucket = {
  name: string;
  standardErrorsCount: number;
  forbiddenErrorsCount: number;
  fileErrorsCount: number;
  standardErrors: ErrorLog[];
  forbiddenErrors: ErrorLog[];
  fileErrors: ErrorLog[];
};

export type ErrorLogs = {
  buckets: ErrorLogsBucket[];
  unknownExceptions: string[];
};

export type ErrorLogsBucketResponse = {
  statusCode: number;
  message: string;
  error: string | null;
  data: ErrorLogs;
};

export type HttpError = {
  message:
    | string
    | {
        startDate?: string;
        endDate?: string;
      };
};
