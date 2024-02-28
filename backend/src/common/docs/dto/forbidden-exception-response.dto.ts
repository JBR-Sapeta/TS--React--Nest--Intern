import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenExceptionResponseDto {
  @ApiProperty({ default: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Access denied.' })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;
}
