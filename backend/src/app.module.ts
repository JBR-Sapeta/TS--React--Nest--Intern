import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ENV_KEYS } from './common/constants';

import { exceptionFactory } from './common/functions';
import type { DatabaseConfigType } from './common/config';
import { CacheModule } from './cache/cache.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === 'test') {
          return {
            type: config.get<DatabaseConfigType>(ENV_KEYS.DB_TYPE),
            database: config.get<string>(ENV_KEYS.DB_NAME),
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: true,
            logging: false,
          };
        }

        return {
          type: config.get<DatabaseConfigType>(ENV_KEYS.DB_TYPE),
          host: config.get<string>(ENV_KEYS.DB_HOST),
          port: +config.get<string>(ENV_KEYS.DB_PORT),
          username: config.get<string>(ENV_KEYS.DB_USER),
          password: config.get<string>(ENV_KEYS.DB_PASSWORD),
          database: config.get<string>(ENV_KEYS.DB_NAME),
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: process.env.NODE_ENV !== 'prod',
          autoLoadEntities: true,
        };
      },
    }),
    UserModule,
    AuthModule,
    MailModule,
    CacheModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new ClassSerializerInterceptor(new Reflector(), {
        strategy: 'excludeAll',
      }),
    },
  ],
})
export class AppModule {}
