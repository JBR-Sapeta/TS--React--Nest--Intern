export type BaseResponse = {
  statusCode: number;
  message: string;
  error: null;
};

export type ResponseWithData<T> = {
  statusCode: number;
  message: string;
  error: null;
  data: T;
};

export type ResponseWithPagination<T> = {
  statusCode: number;
  message: string;
  error: null;
  limit: number;
  pageNumber: number;
  hasNextPage: boolean;
  totalPages: number;
  data: T[];
};

export type BaseError = {
  statusCode: number;
  message: string;
  error: string;
};

export type ValidationError<T> = {
  statusCode: number;
  message: T;
  error: string;
};
