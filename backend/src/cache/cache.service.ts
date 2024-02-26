import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import { Nullish } from '../common/types';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async setData<T>(key: string, value: T): Promise<void> {
    const data = JSON.stringify(value);
    await this.redis.set(key, data);
  }

  public async getData<T>(key: string): Promise<Nullish<T>> {
    const data = await this.redis.get(key);
    return JSON.parse(data) as Nullish<T>;
  }

  public async removeData(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public composeKey(...args: Array<string | number>): string {
    return args.join('_');
  }
}
