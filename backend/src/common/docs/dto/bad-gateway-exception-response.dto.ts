import { ApiProperty } from '@nestjs/swagger';

export class BadGatewayExceptionResponseDto {
  @ApiProperty({ default: 502 })
  statusCode: number;

  @ApiProperty({ example: 'Something went wrong. Please try again later.' })
  message: string;

  @ApiProperty({ example: 'Bad Gateway.' })
  error: string;
}
