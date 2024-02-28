import { ApiProperty } from '@nestjs/swagger';

export class BadGatewayExceptionResponseDto {
  @ApiProperty({ default: 502 })
  statusCode: number;

  @ApiProperty({ example: 'Email delivery failed.' })
  message: string;

  @ApiProperty({ example: 'Bad Gateway.' })
  error: string;
}
