export enum ErrorType {
  STANDARD = 'Standard',
  FORBIDDEN = 'ForbiddenException',
  FILE_OPERATION = 'FileOperation',
}

type HttpErrorStack = {
  attempts: number;
  extendedRequestId: string;
  httpStatusCode: number;
  requestId: string;
  totalRetryDelay: number;
};

export type ErrorLog = {
  context?: string;
  level: string;
  message: string;
  stack: (string | HttpErrorStack)[];
  timestamp?: string;
};
