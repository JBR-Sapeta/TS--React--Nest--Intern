import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { isNil } from 'ramda';

import { PL_ERRORS } from '../locales';
import type { Nullable } from '../common/types';

@Injectable()
export class CacheService implements OnApplicationShutdown {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  public async setData<T>(key: string, value: T): Promise<void> {
    const data = JSON.stringify(value);
    try {
      await this.redis.set(key, data);
    } catch (error) {
      this.logger.error(
        CacheService.name,
        'setData',
        error.message,
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async getData<T>(key: string): Promise<Nullable<T>> {
    try {
      const data = await this.redis.get(key);
      return isNil(data) ? null : (JSON.parse(data) as T);
    } catch (error) {
      this.logger.error(
        CacheService.name,
        'getData',
        error.message,
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async removeData(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(
        CacheService.name,
        'removeData',
        error.message,
        error.stack,
      );

      throw new InternalServerErrorException(PL_ERRORS.INTERNAL_SERVER_ERROR);
    }
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
