import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export type SuccessMessageArgs = {
  message?: string;
  statusCode?: number;
};

export class SuccessMessageDto {
  @ApiProperty({ example: 200 })
  @Expose()
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  @Expose()
  message: string;

  @ApiProperty({ type: () => typeof null, example: null })
  @Expose()
  error: null;

  constructor({ message = 'Succes', statusCode = 200 }: SuccessMessageArgs) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = null;
  }
}
