import { ApiProperty } from '@nestjs/swagger';

export class ConflictExceptionResponseDto {
  @ApiProperty({ default: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Resource already exist.' })
  message: string;

  @ApiProperty({ default: 'Conflict' })
  error: string;
}
