import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorExceptionResponseDto {
  @ApiProperty({ default: 500 })
  statusCode: number;

  @ApiProperty({ example: 'Oops! Something went wrong.' })
  message: string;

  @ApiProperty({ example: 'Internal Server Error' })
  error: string;
}
