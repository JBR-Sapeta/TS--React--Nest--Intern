import { Expose } from 'class-transformer';

import { SuccesMessage } from '../../common/classes';
import type { SuccesMessageArgs } from '../../common/classes';
import { ResponseWithPayload } from '../../common/interfaces';

class AccessToken {
  @Expose()
  accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}

export class AccessTokenDto
  extends SuccesMessage
  implements ResponseWithPayload<AccessToken>
{
  @Expose()
  data: AccessToken;

  constructor(args: SuccesMessageArgs, token: string) {
    super(args);
    this.data = new AccessToken(token);
  }
}
