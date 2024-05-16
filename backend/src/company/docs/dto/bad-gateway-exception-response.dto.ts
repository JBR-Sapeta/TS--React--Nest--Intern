import { ApiProperty } from '@nestjs/swagger';

export class UploadImageBadGatewayExceptionResponseDto {
  @ApiProperty({ default: 502 })
  statusCode: number;

  @ApiProperty({ example: 'File upload failed.' })
  message: string;

  @ApiProperty({ example: 'Bad Gateway.' })
  error: string;
}
