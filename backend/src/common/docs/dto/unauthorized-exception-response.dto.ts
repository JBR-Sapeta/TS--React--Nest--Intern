import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedExceptionResponseDto {
  @ApiProperty({ default: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Invalid credentials.' })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
