import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExceptionResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validation failed (uuid or int is expected)' })
  message: string;

  @ApiProperty({ example: 'Bad Request.' })
  error: string;
}
