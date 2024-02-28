import { ApiProperty } from '@nestjs/swagger';

export class SignUpBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      firstName: 'First name must be longer than or equal to 2 characters.',
      lastName: 'Last name must be longer than or equal to 2 characters.',
      email: 'Please enter correct email address.',
      password:
        'Password must contain both uppercase and lowercase letters, one number and special character.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class LoginBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: 'Please enter correct email address.',
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class AccountRecoveryBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      email: 'Please enter correct email address.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class ResetPasswordBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      resetToken: 'Reset Token should not be empty.',
      password:
        'Password must contain both uppercase and lowercase letters, one number and special character.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class ResendActivationEmailBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: {
      email: 'Please enter correct email address.',
    },
  })
  message: object;

  @ApiProperty({ default: 'Bad Request.' })
  error: string;
}

// ----------------------------------------------------------------------- \\
export class ActivationBadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({
    example: 'Validation failed (uuid is expected).',
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
