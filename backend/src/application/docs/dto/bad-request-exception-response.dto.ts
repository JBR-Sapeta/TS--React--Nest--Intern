import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  names: number;

  @ApiProperty({
    example: {
      message: 'Message cannot be longer than 512 characters.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}
