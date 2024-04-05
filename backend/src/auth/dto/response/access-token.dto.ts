import { Expose } from 'class-transformer';

import { SuccessMessageDto } from '../../../common/classes';
import type { SuccessMessageArgs } from '../../../common/classes';
import { ResponseWithPayload } from '../../../common/interfaces';

class AccessToken {
  @Expose()
  accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}

export class AccessTokenDto
  extends SuccessMessageDto
  implements ResponseWithPayload<AccessToken>
{
  @Expose()
  data: AccessToken;

  constructor(args: SuccessMessageArgs, token: string) {
    super(args);
    this.data = new AccessToken(token);
  }
}
