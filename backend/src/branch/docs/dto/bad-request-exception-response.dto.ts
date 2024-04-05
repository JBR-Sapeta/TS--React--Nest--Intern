import { ApiProperty } from '@nestjs/swagger';

export class CreateBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  names: number;

  @ApiProperty({
    example: {
      name: 'Branch name must be longer than 2 characters and shorter than 255.',
      address: {
        country: 'Country must be longer than 1 characters.',
        region: 'Region must be longer than 2 characters and shorter than 64.',
        postcode:
          'Postcode must be longer than 2 characters and shorter than 32.',
        city: 'City must be longer than 2 characters and shorter than 64.',
        streetName:
          'Street name must be longer than 2 characters and shorter than 64.',
        houseNumber:
          'Region must be longer than 2 characters and shorter than 16.',
        latitude: 'Value must be between 90 and -90.',
        longitude: 'Value must be between 180 and -180.',
      },
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class UpdateBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  names: number;

  @ApiProperty({
    example: {
      name: 'Branch name must be longer than 2 characters and shorter than 255.',
      address: {
        country: 'Country must be longer than 1 characters.',
        region: 'Region must be longer than 2 characters and shorter than 64.',
        postcode:
          'Postcode must be longer than 2 characters and shorter than 32.',
        city: 'City must be longer than 2 characters and shorter than 64.',
        streetName:
          'Street name must be longer than 2 characters and shorter than 64.',
        houseNumber:
          'Region must be longer than 2 characters and shorter than 16.',
        latitude: 'Value must be between 90 and -90.',
        longitude: 'Value must be between 180 and -180.',
      },
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}
