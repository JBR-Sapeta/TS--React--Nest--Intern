export interface ResponseWithPayload<T> {
  statusCode: number;
  message: string;
  error: null;
  data: T;
}
