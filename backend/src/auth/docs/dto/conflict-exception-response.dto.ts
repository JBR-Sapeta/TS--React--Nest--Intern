import { ApiProperty } from '@nestjs/swagger';

export class ConflictExceptionResponseDto {
  @ApiProperty({ default: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Email address already in use.' })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}
