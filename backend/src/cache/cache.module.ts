import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

import type { RedisConfigType } from '../common/config';
import { ENV_KEYS } from '../common/constants';

import { CacheService } from './cache.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<RedisConfigType>(ENV_KEYS.REDIS_TYPE),
          url: config.get<string>(ENV_KEYS.REDIS_URL),
          options: {
            username: config.get<string>(ENV_KEYS.REDIS_USERNAME),
            password: config.get<string>(ENV_KEYS.REDIS_PASSWORD),
          },
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
