import { Expose } from 'class-transformer';

import { SuccesMessage } from '../../common/classes';
import type { SuccesMessageArgs } from '../../common/classes';
import { ResponseWithPayload } from '../../common/interfaces';

export class RefreshToken {
  @Expose()
  token: string;
  @Expose()
  expirationDate: string;

  constructor(token: string, expirationDate: string) {
    this.token = token;
    this.expirationDate = expirationDate;
  }
}

class Tokens {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: RefreshToken;

  constructor(accessToken: string, refreshToken: RefreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class TokensDto
  extends SuccesMessage
  implements ResponseWithPayload<Tokens>
{
  @Expose()
  data: Tokens;

  constructor(
    args: SuccesMessageArgs,
    accessToken: string,
    refreshToken: RefreshToken,
  ) {
    super(args);

    this.data = new Tokens(accessToken, refreshToken);
  }
}
