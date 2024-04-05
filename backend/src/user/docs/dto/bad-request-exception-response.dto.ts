import { ApiProperty } from '@nestjs/swagger';

export class UpdateBadRequestExceptionResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      firstName: 'First name must be longer than or equal to 2 characters.',
      lastName: 'Last name must be longer than or equal to 2 characters.',
      phoneNumber: 'Phone number must be a valid phone number',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class EmailBadRequestExceptionResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      email: 'Please enter correct email address.',
      password: 'Password should not be empty.',
    },
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class PasswordBadRequestExceptionResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      newPassword:
        'Password must contain both uppercase and lowercase letters, one number and special character.',
      password: 'Password should not be empty.',
    },
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class DeleteBadRequestExceptionResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      password: 'Password should not be empty.',
    },
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
