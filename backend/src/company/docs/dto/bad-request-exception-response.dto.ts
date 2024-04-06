import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      name: 'Company name must be longer than 1 character and shorter than 255.',
      slug: 'Enter lowercase sluggified string.',
      email: 'Please enter correct email address.',
      description: 'Company description must be at least 32 characters long.',
      size: 'Company size must be greater than 0.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

// ----------------------------------------------------------------------- \\

export class UpdateCompanyBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      name: 'Company name must be longer than 1 character and shorter than 255.',
      slug: 'Enter lowercase sluggified string.',
      email: 'Please enter correct email address.',
      phoneNumber: 'Please enter correct phone number.',
      description: 'Company description must be at least 32 characters long.',
      size: 'Company size must be greater than 0.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}
