import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationBadGatewayExceptionResponseDto {
  @ApiProperty({ default: 502 })
  statusCode: number;

  @ApiProperty({ example: 'File upload failed.' })
  message: string;

  @ApiProperty({ example: 'Bad Gateway.' })
  error: string;
}

export class GetApplicationBadGatewayExceptionResponseDto {
  @ApiProperty({ default: 502 })
  statusCode: number;

  @ApiProperty({ example: 'Getting file failed.' })
  message: string;

  @ApiProperty({ example: 'Bad Gateway.' })
  error: string;
}

export class DeleteApplicationBadGatewayExceptionResponseDto {
  @ApiProperty({ default: 502 })
  statusCode: number;

  @ApiProperty({ example: 'Deleting file failed.' })
  message: string;

  @ApiProperty({ example: 'Bad Gateway.' })
  error: string;
}
