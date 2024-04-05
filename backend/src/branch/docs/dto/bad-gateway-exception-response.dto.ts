import { ApiProperty } from '@nestjs/swagger';

export class BadGatewayExceptionResponseDto {
  @ApiProperty({ default: 502 })
  statusCode: number;

  @ApiProperty({ example: 'Address verification faild.' })
  message: string;

  @ApiProperty({ example: 'Bad Gateway.' })
  error: string;
}
