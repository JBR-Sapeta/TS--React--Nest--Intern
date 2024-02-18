import { Expose } from 'class-transformer';

import { SuccesMessage } from '../../common/classes';
import type { SuccesMessageArgs } from '../../common/classes';
import { ResponseWithPayload } from '../../common/interfaces';
import type { AccessToken } from '../../common/types';

export class AccessTokenDto
  extends SuccesMessage
  implements ResponseWithPayload<AccessToken>
{
  @Expose()
  data: AccessToken;

  constructor(args: SuccesMessageArgs, data: AccessToken) {
    super(args);
    this.data = data;
  }
}
