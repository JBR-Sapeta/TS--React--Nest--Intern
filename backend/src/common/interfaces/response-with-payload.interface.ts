export interface ResponseWithPayload<T> {
  stausCode: number;
  message: string;
  error: null;
  data: T;
}
