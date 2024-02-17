export class SuccesMessage {
  stausCode: number;
  message: string;
  error: null;

  constructor({ message = 'Succes', statusCode = 200 }) {
    this.message = message;
    this.stausCode = statusCode;
    this.error = null;
  }
}
