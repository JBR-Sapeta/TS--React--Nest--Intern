import { ApiProperty } from '@nestjs/swagger';

export class GetOffersBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  names: number;

  @ApiProperty({
    example: {
      pageNumber: 'Page number must not be less than 0',
      limit: 'Limit must not be greater than 100',
      employmentType: 'Wmployment type must not be greater than 5',
      operatingMode: 'Operating mode must not be greater than 3',
      lat: 'Lat must not be greater than 90',
      long: 'Long must not be greater than 180',
      range: 'Range must not be greater than 100',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

export class CreateBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  names: number;

  @ApiProperty({
    example: {
      title: 'Title must be longer than 4 character and shorter than 64.',
      position: 'Position must be longer than 2 character and shorter than 64.',
      description:
        'Description must be longer than 24 character and shorter than 3072.',
      isPaid: 'Enter boolean value.',
      isActive: 'Enter boolean value.',
      employmentType: 'Employment type should be an integer between 1 and 5.',
      operatingMode: 'Operating mode should be an integer between 1 and 5.',
      expirationTime: 'Expiration time should be an integer between 7 and 42. ',
      branches: 'Invalid value. An array of integers is required.',
      categories: 'Invalid value. An array of integers is required.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

export class UpdateBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  names: number;

  @ApiProperty({
    example: {
      title: 'Title must be longer than 4 character and shorter than 64.',
      position: 'Position must be longer than 2 character and shorter than 64.',
      description:
        'Description must be longer than 24 character and shorter than 3072.',
      isPaid: 'Enter boolean value.',
      isActive: 'Enter boolean value.',
      employmentType: 'Employment type should be an integer between 1 and 5.',
      operatingMode: 'Operating mode should be an integer between 1 and 5.',
      branches: 'Invalid value. An array of integers is required.',
      categories: 'Invalid value. An array of integers is required.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}
