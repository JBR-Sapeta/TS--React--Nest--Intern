import { ApiProperty } from '@nestjs/swagger';

export class OkResponseDto {
  @ApiProperty({ default: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Sucess.' })
  message: string;

  @ApiProperty({ example: null })
  error: string;
}
