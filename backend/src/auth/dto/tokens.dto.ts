import { Expose } from 'class-transformer';

import { SuccesMessage } from '../../common/classes';
import type { SuccesMessageArgs } from '../../common/classes';
import { ResponseWithPayload } from '../../common/interfaces';
import { type Tokens } from '../../common/types';

export class TokensDto
  extends SuccesMessage
  implements ResponseWithPayload<Tokens>
{
  @Expose()
  data: Tokens;

  constructor(args: SuccesMessageArgs, data: Tokens) {
    super(args);

    this.data = data;
  }
}
