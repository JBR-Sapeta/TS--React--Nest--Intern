export class Payload<T> {
  stausCode: number;
  message: string;
  error: null;
  data: T;

  constructor({ message = 'Succes', statusCode = 200 }, data: T) {
    this.message = message;
    this.stausCode = statusCode;
    this.error = null;
    this.data = data;
  }
}
