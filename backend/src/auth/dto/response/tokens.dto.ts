import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { SuccessMessageDto } from '../../../common/classes';
import type { SuccessMessageArgs } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

export class RefreshToken {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MmJhOS0zM2RmLTQyNDQtODJhOS1mZTk3NzI5M2FiMjAiLCJpYXQiOjE3MDg4OTE5NDUsImV4cCI6MTcwODg5MjU0NX0.sYLRIXTnJc3mNaz5lOz80raUeX2UV-mQw3jHThJwiUc',
  })
  @Expose()
  token: string;

  @ApiProperty({ example: '2024-02-28T23:20:32.083Z' })
  @Expose()
  expirationDate: string;

  constructor(token: string, expirationDate: string) {
    this.token = token;
    this.expirationDate = expirationDate;
  }
}

class Tokens {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U0MmJhOS0zM2RmLTQyNDQtODJhOS1mZTk3NzI5M2FiMjAiLCJpYXQiOjE3MDkwNzYwMzIsImV4cCI6MTcwOTE2MjQzMn0.lRuwKqT7tPJJDGTpTWKe8bWad-dgh68QvxvOVZWfbpY',
  })
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: RefreshToken;

  constructor(accessToken: string, refreshToken: RefreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class TokensDto
  extends SuccessMessageDto
  implements ResponseWithPayload<Tokens>
{
  @ApiProperty()
  @Expose()
  data: Tokens;

  constructor(
    args: SuccessMessageArgs,
    accessToken: string,
    refreshToken: RefreshToken,
  ) {
    super(args);

    this.data = new Tokens(accessToken, refreshToken);
  }
}
