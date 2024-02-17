export type SuccesMessage = {
  statusCode: number;
  message: string;
  error: null;
};

export type PageData<T> = {
  data: T[];
  limit: number;
  pageNumber: number;
  hasNextPage: boolean;
  totalPages: number;
};
