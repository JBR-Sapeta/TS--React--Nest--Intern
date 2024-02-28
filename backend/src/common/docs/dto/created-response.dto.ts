import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponseDto {
  @ApiProperty({ default: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Created.' })
  message: string;

  @ApiProperty({ example: null })
  error: string;
}
