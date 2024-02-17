import { ClassConstructor } from '../interfaces';

export class SerializedPayload<T extends ClassConstructor> {
  stausCode: number;
  message: string;
  error: null;
  data: T;

  constructor(
    { message = 'Succes', statusCode = 200 },
    DtoClass: T,
    args: any,
  ) {
    this.message = message;
    this.stausCode = statusCode;
    this.error = null;
    this.data = new DtoClass(args);
  }
}
