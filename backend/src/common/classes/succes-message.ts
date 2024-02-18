import { Expose } from 'class-transformer';

export type SuccesMessageArgs = {
  message?: string;
  statusCode?: number;
};

export class SuccesMessage {
  @Expose()
  stausCode: number;
  @Expose()
  message: string;
  @Expose()
  error: null;

  constructor({ message = 'Succes', statusCode = 200 }: SuccesMessageArgs) {
    this.message = message;
    this.stausCode = statusCode;
    this.error = null;
  }
}
