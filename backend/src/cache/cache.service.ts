import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import type { Nullable } from '../common/types';

@Injectable()
export class CacheService implements OnApplicationShutdown {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async setData<T>(key: string, value: T): Promise<void> {
    const data = JSON.stringify(value);
    await this.redis.set(key, data);
  }

  public async getData<T>(key: string): Promise<Nullable<T>> {
    const data = await this.redis.get(key);
    return JSON.parse(data) as Nullable<T>;
  }

  public async removeData(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public composeKey(...args: Array<string | number>): string {
    return args.join('_');
  }

  public async onApplicationShutdown() {
    if (this.redis.status === 'ready') {
      await this.redis.quit();
    }
  }
}
